defmodule Runcom.Steps.WaitForTest do
  use ExUnit.Case, async: true

  alias Runcom.Steps.WaitFor

  describe "__name__/0" do
    test "returns step name via __name__" do
      assert WaitFor.__name__() == "WaitFor"
    end
  end

  describe "validate/1" do
    test "requires at least one condition" do
      assert WaitFor.validate(%{tcp_port: 4000}) == :ok
      assert WaitFor.validate(%{path: "/tmp/ready"}) == :ok
      assert {:error, _} = WaitFor.validate(%{})
    end
  end

  describe "run/2 with path" do
    @tag :tmp_dir
    test "succeeds when file exists", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "ready")
      File.write!(path, "")

      {:ok, result} = WaitFor.run(nil, %{path: path, timeout: 100})

      assert result.status == :ok
    end

    @tag :tmp_dir
    test "succeeds when file is created", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "delayed")

      # Create file after 50ms
      Task.start(fn ->
        Process.sleep(50)
        File.write!(path, "")
      end)

      {:ok, result} = WaitFor.run(nil, %{path: path, timeout: 500, interval: 25})

      assert result.status == :ok
    end

    @tag :tmp_dir
    test "times out when file never exists", %{tmp_dir: tmp_dir} do
      path = Path.join(tmp_dir, "never")

      {:ok, result} = WaitFor.run(nil, %{path: path, timeout: 100, interval: 25})

      assert result.status == :error
      assert result.error =~ "timeout"
    end
  end

  describe "run/2 with tcp_port" do
    test "succeeds when port is already listening" do
      # Start a TCP listener on an available port
      {:ok, listen_socket} = :gen_tcp.listen(0, [:binary, active: false, reuseaddr: true])
      {:ok, tcp_port} = :inet.port(listen_socket)

      try do
        {:ok, result} = WaitFor.run(nil, %{tcp_port: tcp_port, timeout: 100})

        assert result.status == :ok
      after
        :gen_tcp.close(listen_socket)
      end
    end

    test "succeeds when port becomes available" do
      # Find an available port first
      {:ok, temp_socket} = :gen_tcp.listen(0, [:binary, active: false, reuseaddr: true])
      {:ok, tcp_port} = :inet.port(temp_socket)
      :gen_tcp.close(temp_socket)

      # Start the listener after a delay
      Task.start(fn ->
        Process.sleep(50)
        {:ok, socket} = :gen_tcp.listen(tcp_port, [:binary, active: false, reuseaddr: true])
        # Keep the socket open for the test to connect
        Process.sleep(500)
        :gen_tcp.close(socket)
      end)

      {:ok, result} = WaitFor.run(nil, %{tcp_port: tcp_port, timeout: 500, interval: 25})

      assert result.status == :ok
    end

    test "times out when port never opens" do
      # Use a high port that is unlikely to be listening
      tcp_port = 59999

      {:ok, result} = WaitFor.run(nil, %{tcp_port: tcp_port, timeout: 100, interval: 25})

      assert result.status == :error
      assert result.error =~ "timeout"
    end

    test "uses custom host" do
      # localhost should work, some random host should fail quickly
      {:ok, result} =
        WaitFor.run(nil, %{tcp_port: 59998, host: "localhost", timeout: 100, interval: 25})

      assert result.status == :error
    end
  end

  describe "dryrun/2" do
    test "returns what would be waited for with tcp_port" do
      {:ok, result} = WaitFor.dryrun(nil, %{tcp_port: 4000, timeout: 60_000})

      assert result.status == :ok
      assert result.output =~ "tcp_port 4000"
    end

    test "returns what would be waited for with path" do
      {:ok, result} = WaitFor.dryrun(nil, %{path: "/var/run/app.ready"})

      assert result.status == :ok
      assert result.output =~ "/var/run/app.ready"
    end
  end
end
