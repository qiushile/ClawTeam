# A100 GPU服务器性能测试方案 - Ubuntu 22.04 LTS

## 1. 系统初始化与硬件检测

### 1.1 系统信息收集
```bash
# 详细系统信息收集
echo "=== 系统信息 ==="
uname -a
cat /proc/version
cat /etc/os-release

echo "=== CPU信息 ==="
lscpu
cat /proc/cpuinfo | grep "model name" | head -1

echo "=== 内存信息 ==="
free -h
cat /proc/meminfo | grep MemTotal

echo "=== GPU设备信息 ==="
lspci | grep -i nvidia
nvidia-smi -q -x | grep -A 20 "gpu.0"

echo "=== 存储设备信息 ==="
lsblk
cat /proc/partitions

echo "=== 网络设备信息 ==="
ip addr
lspci | grep -i ethernet
```

### 1.2 创建检测脚本
```bash
cat > system_check.sh << 'EOF'
#!/bin/bash
echo "=== 系统信息 ==="
uname -a
cat /proc/version
cat /etc/os-release

echo "=== CPU信息 ==="
lscpu
cat /proc/cpuinfo | grep "model name" | head -1

echo "=== 内存信息 ==="
free -h
cat /proc/meminfo | grep MemTotal

echo "=== GPU设备信息 ==="
lspci | grep -i nvidia
nvidia-smi -q -x | grep -A 20 "gpu.0"

echo "=== 存储设备信息 ==="
lsblk
cat /proc/partitions

echo "=== 网络设备信息 ==="
ip addr
lspci | grep -i ethernet
EOF

chmod +x system_check.sh
```

## 2. NVIDIA驱动和CUDA环境安装

### 2.1 安装依赖包
```bash
sudo apt update
sudo apt install -y build-essential gcc g++ make
sudo apt install -y linux-headers-$(uname -r)
```

### 2.2 禁用开源nouveau驱动（如适用）
```bash
echo 'blacklist nouveau' | sudo tee -a /etc/modprobe.d/blacklist.conf
echo 'options nouveau modeset=0' | sudo tee -a /etc/modprobe.d/blacklist.conf
sudo update-initramfs -u
sudo reboot
```

### 2.3 安装NVIDIA驱动
```bash
# 方法1：使用ubuntu-drivers自动安装
sudo apt install ubuntu-drivers-common
sudo ubuntu-drivers autoinstall

# 方法2：手动下载并安装最新驱动
wget https://us.download.nvidia.com/XFree86/Linux-x86_64/535.129.03/NVIDIA-Linux-x86_64-535.129.03.run
sudo sh ./NVIDIA-Linux-x86_64-535.129.03.run
```

### 2.4 安装CUDA Toolkit 12.0
```bash
# 下载CUDA Toolkit
wget https://developer.download.nvidia.com/compute/cuda/12.0.0/local_installers/cuda_12.0.0_525.60.13_linux.run
sudo sh cuda_12.0.0_525.60.13_linux.run

# 或使用APT仓库安装
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-keyring_1.0-1_all.deb
sudo dpkg -i cuda-keyring_1.0-1_all.deb
sudo apt-get update
sudo apt-get -y install cuda-toolkit-12-0
```

### 2.5 配置环境变量
```bash
echo 'export PATH=/usr/local/cuda/bin:$PATH' >> ~/.bashrc
echo 'export LD_LIBRARY_PATH=/usr/local/cuda/lib64:$LD_LIBRARY_PATH' >> ~/.bashrc
source ~/.bashrc
```

## 3. 详细GPU性能测试

### 3.1 基础GPU信息检查
```bash
# 详细GPU信息
nvidia-smi -q

# 检查CUDA版本
nvcc --version

# GPU架构信息
nvidia-ml-py3 -c "
import pynvml
pynvml.nvmlInit()
handle = pynvml.nvmlDeviceGetHandleByIndex(0)
arch = pynvml.nvmlDeviceGetArchitecture(handle)
print('GPU Architecture:', arch)
"
```

### 3.2 CUDA计算能力测试
```bash
# 编译并运行CUDA Samples
cd /usr/local/cuda/samples/1_Utilities/deviceQuery
sudo make
sudo ./deviceQuery

# CUDA带宽测试
cd /usr/local/cuda/samples/1_Utilities/bandwidthTest
sudo make
sudo ./bandwidthTest

# 编译并运行SGEMM测试（矩阵乘法）
cd /usr/local/cuda/samples/0_Simple/matrixMul
sudo make
sudo ./matrixMul
```

### 3.3 专业GPU基准测试
```bash
# 安装GPU基准测试工具
git clone https://github.com/Lutzifer/NVIDIA-GPUs-Benchmark.git
cd NVIDIA-GPUs-Benchmark
chmod +x gpu_burn.sh
sudo ./gpu_burn.sh

# 或者使用gbench
git clone https://github.com/ComputationalRadiationPhysics/gbench.git
cd gbench
make
./gbench
```

## 4. FP32/FP64/TF32算力测试

### 4.1 SGEMM (FP32) 算力测试
```bash
# 创建SGEMM测试程序
cat > sgemm_test.cu << 'EOF'
#include <cuda_runtime.h>
#include <cublas_v2.h>
#include <stdio.h>
#include <sys/time.h>

int main() {
    const int N = 4096;
    float *A, *B, *C;
    float *d_A, *d_B, *d_C;
    cublasHandle_t handle;
    
    // 分配主机内存
    A = (float*)malloc(N*N*sizeof(float));
    B = (float*)malloc(N*N*sizeof(float));
    C = (float*)malloc(N*N*sizeof(float));
    
    // 初始化矩阵
    for(int i = 0; i < N*N; i++) {
        A[i] = rand() / (float)RAND_MAX;
        B[i] = rand() / (float)RAND_MAX;
    }
    
    // 分配设备内存
    cudaMalloc(&d_A, N*N*sizeof(float));
    cudaMalloc(&d_B, N*N*sizeof(float));
    cudaMalloc(&d_C, N*N*sizeof(float));
    
    // 复制数据到设备
    cudaMemcpy(d_A, A, N*N*sizeof(float), cudaMemcpyHostToDevice);
    cudaMemcpy(d_B, B, N*N*sizeof(float), cudaMemcpyHostToDevice);
    
    // 初始化cuBLAS
    cublasCreate(&handle);
    
    struct timeval start, end;
    gettimeofday(&start, NULL);
    
    const float alpha = 1.0f, beta = 0.0f;
    cublasSgemm(handle, CUBLAS_OP_N, CUBLAS_OP_N, 
                N, N, N, &alpha, d_A, N, d_B, N, &beta, d_C, N);
    
    cudaDeviceSynchronize();
    gettimeofday(&end, NULL);
    
    double elapsed = (end.tv_sec - start.tv_sec) + (end.tv_usec - start.tv_usec) / 1000000.0;
    
    double flops = 2.0 * N * N * N / elapsed / 1e12;
    printf("SGEMM Performance: %.2f TFLOPS\n", flops);
    
    // 清理
    cublasDestroy(handle);
    cudaFree(d_A);
    cudaFree(d_B);
    cudaFree(d_C);
    free(A);
    free(B);
    free(C);
    
    return 0;
}
EOF

nvcc -o sgemm_test sgemm_test.cu -lcublas
./sgemm_test
```

### 4.2 DGEMM (FP64) 算力测试
```bash
# 创建DGEMM测试程序
cat > dgemm_test.cu << 'EOF'
#include <cuda_runtime.h>
#include <cublas_v2.h>
#include <stdio.h>
#include <sys/time.h>

int main() {
    const int N = 2048; // 较小的尺寸以适应FP64计算
    double *A, *B, *C;
    double *d_A, *d_B, *d_C;
    cublasHandle_t handle;
    
    // 分配主机内存
    A = (double*)malloc(N*N*sizeof(double));
    B = (double*)malloc(N*N*sizeof(double));
    C = (double*)malloc(N*N*sizeof(double));
    
    // 初始化矩阵
    for(int i = 0; i < N*N; i++) {
        A[i] = rand() / (double)RAND_MAX;
        B[i] = rand() / (double)RAND_MAX;
    }
    
    // 分配设备内存
    cudaMalloc(&d_A, N*N*sizeof(double));
    cudaMalloc(&d_B, N*N*sizeof(double));
    cudaMalloc(&d_C, N*N*sizeof(double));
    
    // 复制数据到设备
    cudaMemcpy(d_A, A, N*N*sizeof(double), cudaMemcpyHostToDevice);
    cudaMemcpy(d_B, B, N*N*sizeof(double), cudaMemcpyHostToDevice);
    
    // 初始化cuBLAS
    cublasCreate(&handle);
    
    struct timeval start, end;
    gettimeofday(&start, NULL);
    
    const double alpha = 1.0, beta = 0.0;
    cublasDgemm(handle, CUBLAS_OP_N, CUBLAS_OP_N, 
                N, N, N, &alpha, d_A, N, d_B, N, &beta, d_C, N);
    
    cudaDeviceSynchronize();
    gettimeofday(&end, NULL);
    
    double elapsed = (end.tv_sec - start.tv_sec) + (end.tv_usec - start.tv_usec) / 1000000.0;
    
    double flops = 2.0 * N * N * N / elapsed / 1e12;
    printf("DGEMM Performance: %.2f TFLOPS\n", flops);
    
    // 清理
    cublasDestroy(handle);
    cudaFree(d_A);
    cudaFree(d_B);
    cudaFree(d_C);
    free(A);
    free(B);
    free(C);
    
    return 0;
}
EOF

nvcc -o dgemm_test dgemm_test.cu -lcublas
./dgemm_test
```

### 4.3 Tensor Core算力测试
```bash
# 使用cuBLAS GEMM函数测试Tensor Core性能
cat > tensor_core_test.cu << 'EOF'
#include <cuda_runtime.h>
#include <cublas_v2.h>
#include <cuda_fp16.h>
#include <stdio.h>
#include <sys/time.h>

int main() {
    const int N = 4096;
    __half *A, *B, *C;
    __half *d_A, *d_B, *d_C;
    cublasHandle_t handle;
    
    // 分配主机内存
    A = (__half*)malloc(N*N*sizeof(__half));
    B = (__half*)malloc(N*N*sizeof(__half));
    C = (__half*)malloc(N*N*sizeof(__half));
    
    // 初始化矩阵
    for(int i = 0; i < N*N; i++) {
        A[i] = __float2half(rand() / (float)RAND_MAX);
        B[i] = __float2half(rand() / (float)RAND_MAX);
    }
    
    // 分配设备内存
    cudaMalloc(&d_A, N*N*sizeof(__half));
    cudaMalloc(&d_B, N*N*sizeof(__half));
    cudaMalloc(&d_C, N*N*sizeof(__half));
    
    // 复制数据到设备
    cudaMemcpy(d_A, A, N*N*sizeof(__half), cudaMemcpyHostToDevice);
    cudaMemcpy(d_B, B, N*N*sizeof(__half), cudaMemcpyHostToDevice);
    
    // 初始化cuBLAS
    cublasCreate(&handle);
    
    struct timeval start, end;
    gettimeofday(&start, NULL);
    
    const __half alpha = __float2half(1.0f), beta = __float2half(0.0f);
    cublasHgemm(handle, CUBLAS_OP_N, CUBLAS_OP_N, 
                N, N, N, &alpha, d_A, N, d_B, N, &beta, d_C, N);
    
    cudaDeviceSynchronize();
    gettimeofday(&end, NULL);
    
    double elapsed = (end.tv_sec - start.tv_sec) + (end.tv_usec - start.tv_usec) / 1000000.0;
    
    // 对于Tensor Core，理论性能更高
    double flops = 2.0 * N * N * N / elapsed / 1e12;
    printf("Tensor Core FP16 GEMM Performance: %.2f TFLOPS\n", flops);
    
    // 清理
    cublasDestroy(handle);
    cudaFree(d_A);
    cudaFree(d_B);
    cudaFree(d_C);
    free(A);
    free(B);
    free(C);
    
    return 0;
}
EOF

nvcc -o tensor_core_test tensor_core_test.cu -lcublas -lcurand
./tensor_core_test
```

## 5. 显存带宽测试
```bash
# 使用CUDA编写显存带宽测试
cat > memory_bandwidth_test.cu << 'EOF'
#include <cuda_runtime.h>
#include <stdio.h>
#include <sys/time.h>

__global__ void memory_bandwidth_kernel(float* input, float* output, int n) {
    int idx = blockIdx.x * blockDim.x + threadIdx.x;
    if (idx < n) {
        output[idx] = input[idx];
    }
}

int main() {
    const int N = 1<<28; // 256M elements
    const size_t size = N * sizeof(float);
    
    float *h_a, *h_b;
    float *d_a, *d_b;
    
    // 分配主机内存
    h_a = (float*)malloc(size);
    h_b = (float*)malloc(size);
    
    // 初始化数据
    for(int i = 0; i < N; i++) {
        h_a[i] = 1.0f;
    }
    
    // 分配设备内存
    cudaMalloc(&d_a, size);
    cudaMalloc(&d_b, size);
    
    // 复制数据到设备
    cudaMemcpy(d_a, h_a, size, cudaMemcpyHostToDevice);
    
    // 配置kernel参数
    int blockSize = 256;
    int numBlocks = (N + blockSize - 1) / blockSize;
    
    struct timeval start, end;
    gettimeofday(&start, NULL);
    
    // 执行kernel
    memory_bandwidth_kernel<<<numBlocks, blockSize>>>(d_a, d_b, N);
    cudaDeviceSynchronize();
    
    gettimeofday(&end, NULL);
    
    double elapsed = (end.tv_sec - start.tv_sec) + (end.tv_usec - start.tv_usec) / 1000000.0;
    
    double bandwidth = 2.0 * size / elapsed / 1e9; // GB/s
    printf("Memory Bandwidth: %.2f GB/s\n", bandwidth);
    
    // 清理
    cudaFree(d_a);
    cudaFree(d_b);
    free(h_a);
    free(h_b);
    
    return 0;
}
EOF

nvcc -o memory_bandwidth_test memory_bandwidth_test.cu
./memory_bandwidth_test
```

## 6. NVLink带宽测试
```bash
# 检查NVLink连接
nvidia-smi nvlink -s

# 如果有多张A100，测试GPU间通信带宽
# 编写多GPU通信测试程序
cat > nvlink_test.cu << 'EOF'
#include <cuda_runtime.h>
#include <stdio.h>
#include <sys/time.h>

int main() {
    int deviceCount;
    cudaGetDeviceCount(&deviceCount);
    
    if(deviceCount < 2) {
        printf("Need at least 2 GPUs for NVLink test\n");
        return -1;
    }
    
    // 设置设备
    cudaSetDevice(0);
    float *d_A0, *d_A1;
    const int N = 1<<26; // 64M elements
    const size_t size = N * sizeof(float);
    
    cudaMalloc(&d_A0, size);
    cudaSetDevice(1);
    cudaMalloc(&d_A1, size);
    
    // 创建Peer-to-Peer访问
    cudaSetDevice(0);
    cudaDeviceEnablePeerAccess(1, 0);
    
    struct timeval start, end;
    gettimeofday(&start, NULL);
    
    // GPU间数据传输
    cudaMemcpyPeer(d_A1, 1, d_A0, 0, size);
    
    cudaDeviceSynchronize();
    gettimeofday(&end, NULL);
    
    double elapsed = (end.tv_sec - start.tv_sec) + (end.tv_usec - start.tv_usec) / 1000000.0;
    
    double bandwidth = size / elapsed / 1e9; // GB/s
    printf("NVLink Bandwidth: %.2f GB/s\n", bandwidth);
    
    // 清理
    cudaFree(d_A0);
    cudaFree(d_A1);
    
    return 0;
}
EOF

nvcc -o nvlink_test nvlink_test.cu
./nvlink_test
```

## 7. 存储性能测试
```bash
# 详细存储基准测试
sudo apt install fio hdparm smartmontools

# 顺序读写测试
fio --name=seq_read --rw=read --bs=1M --size=4G --numjobs=1 --runtime=60 --time_based --ioengine=libaio --direct=1 --group_reporting
fio --name=seq_write --rw=write --bs=1M --size=4G --numjobs=1 --runtime=60 --time_based --ioengine=libaio --direct=1 --group_reporting

# 随机读写IOPS测试
fio --name=rand_read --rw=randread --bs=4k --size=4G --numjobs=1 --runtime=60 --time_based --ioengine=libaio --direct=1 --iodepth=64 --group_reporting
fio --name=rand_write --rw=randwrite --bs=4k --size=4G --numjobs=1 --runtime=60 --time_based --ioengine=libaio --direct=1 --iodepth=64 --group_reporting

# 使用dd测试简单读写速度
sync; dd if=/dev/zero of=testfile bs=1G count=4 oflag=direct
sync; dd if=testfile of=/dev/null bs=1G count=4 iflag=direct
rm testfile

# 硬盘健康检查
sudo smartctl -a /dev/sda
```

## 8. 网络性能测试
```bash
# 网络基准测试
sudo apt install iperf3 netperf mtr

# 本地网络接口检查
ip addr
ethtool eth0  # 替换为实际网卡名称

# 带宽测试（需要另一台机器作为服务器）
iperf3 -c [目标服务器IP] -t 60 -P 4  # 4个并行流

# 网络延迟测试
ping -c 100 [目标服务器IP]

# 更详细的网络诊断
mtr --report --report-cycles 100 [目标服务器IP]
```

## 9. AI模型基准测试

### 9.1 安装深度学习框架
```bash
# 安装Python和相关包
sudo apt install python3-pip python3-dev
pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
pip3 install tensorflow[and-cuda]
pip3 install transformers datasets accelerate scikit-learn
```

### 9.2 ResNet50基准测试
```bash
cat > resnet50_benchmark.py << 'EOF'
import torch
import torchvision.models as models
import time
import numpy as np

def benchmark_model(model, input_tensor, warmup=10, runs=100):
    # 预热
    for _ in range(warmup):
        _ = model(input_tensor)
    
    torch.cuda.synchronize()
    
    # 正式测试
    times = []
    for _ in range(runs):
        start_time = time.time()
        _ = model(input_tensor)
        torch.cuda.synchronize()
        end_time = time.time()
        times.append(end_time - start_time)
    
    avg_time = np.mean(times)
    std_time = np.std(times)
    fps = 1.0 / avg_time
    
    return avg_time, std_time, fps

# 设置模型和输入
model = models.resnet50(pretrained=True).cuda().eval()
input_tensor = torch.randn(1, 3, 224, 224, device='cuda')

avg_time, std_time, fps = benchmark_model(model, input_tensor)
print(f'ResNet50 - Average inference time: {avg_time:.4f}s ± {std_time:.4f}s')
print(f'ResNet50 - FPS: {fps:.2f}')
print(f'ResNet50 - Latency: {avg_time*1000:.2f}ms')
EOF

python3 resnet50_benchmark.py
```

### 9.3 BERT模型测试
```bash
cat > bert_benchmark.py << 'EOF'
import torch
from transformers import BertModel, BertTokenizer
import time
import numpy as np

def benchmark_bert():
    # 加载模型和tokenizer
    model_name = 'bert-base-uncased'
    tokenizer = BertTokenizer.from_pretrained(model_name)
    model = BertModel.from_pretrained(model_name).cuda().eval()
    
    # 准备输入
    text = "A quick brown fox jumps over the lazy dog." * 10  # 长文本
    inputs = tokenizer(text, return_tensors='pt', padding=True, truncation=True, max_length=512)
    input_ids = inputs['input_ids'].cuda()
    attention_mask = inputs['attention_mask'].cuda()
    
    # 预热
    for _ in range(10):
        _ = model(input_ids=input_ids, attention_mask=attention_mask)
    
    torch.cuda.synchronize()
    
    # 正式测试
    times = []
    for _ in range(100):
        start_time = time.time()
        _ = model(input_ids=input_ids, attention_mask=attention_mask)
        torch.cuda.synchronize()
        end_time = time.time()
        times.append(end_time - start_time)
    
    avg_time = np.mean(times)
    std_time = np.std(times)
    throughput = 1.0 / avg_time
    
    print(f'BERT - Average inference time: {avg_time:.4f}s ± {std_time:.4f}s')
    print(f'BERT - Throughput: {throughput:.2f} sentences/sec')

benchmark_bert()
EOF

python3 bert_benchmark.py
```

### 9.4 大规模模型测试
```bash
cat > large_model_test.py << 'EOF'
import torch
import time
import numpy as np

def benchmark_large_model():
    # 创建一个较大的模型来测试内存和计算性能
    model = torch.nn.Sequential(
        torch.nn.Linear(4096, 8192),
        torch.nn.ReLU(),
        torch.nn.Linear(8192, 4096),
        torch.nn.ReLU(),
        torch.nn.Linear(4096, 2048)
    ).cuda().half()  # 使用半精度以节省显存
    
    # 输入张量
    input_tensor = torch.randn(32, 4096, dtype=torch.half).cuda()
    
    # 预热
    for _ in range(20):
        _ = model(input_tensor)
    
    torch.cuda.synchronize()
    
    # 正式测试
    times = []
    for _ in range(100):
        start_time = time.time()
        _ = model(input_tensor)
        torch.cuda.synchronize()
        end_time = time.time()
        times.append(end_time - start_time)
    
    avg_time = np.mean(times)
    std_time = np.std(times)
    throughput = 32 / avg_time  # 每秒处理的样本数
    
    print(f'Large Model - Average inference time: {avg_time:.4f}s ± {std_time:.4f}s')
    print(f'Large Model - Throughput: {throughput:.2f} samples/sec')
    print(f'Large Model - Batch Size: 32')

benchmark_large_model()
EOF

python3 large_model_test.py
```

## 10. 系统稳定性与功耗测试

### 10.1 GPU压力测试
```bash
# 使用nvidia-ml-py监控GPU状态
cat > stress_test_monitor.py << 'EOF'
import pynvml
import time
import subprocess

def monitor_gpu():
    pynvml.nvmlInit()
    handle = pynvml.nvmlDeviceGetHandleByIndex(0)
    
    print("Starting GPU monitoring...")
    print("Time\tTemp\tPower\tUtil%\tMem%")
    
    try:
        while True:
            # 获取温度
            temp = pynvml.nvmlDeviceGetTemperature(handle, pynvml.NVML_TEMPERATURE_GPU)
            
            # 获取功耗
            power = pynvml.nvmlDeviceGetPowerUsage(handle) / 1000.0  # 转换为瓦特
            
            # 获取利用率
            util = pynvml.nvmlDeviceGetUtilizationRates(handle)
            gpu_util = util.gpu
            mem_util = util.memory
            
            # 打印信息
            print(f"{time.strftime('%H:%M:%S')}\t{temp}°C\t{power:.1f}W\t{gpu_util}%\t{mem_util}%")
            
            time.sleep(5)  # 每5秒更新一次
    except KeyboardInterrupt:
        print("\nMonitoring stopped.")

if __name__ == "__main__":
    monitor_gpu()
EOF

# 在另一个终端运行压力测试
cat > gpu_stress.sh << 'EOF'
#!/bin/bash
# 使用nvidia-ml-py或其他工具进行GPU压力测试
# 或者运行长时间的CUDA计算任务
while true; do
    nvidia-smi -q -d UTILIZATION,MEMORY,POWER,CLOCK,COMPUTE -f /tmp/nvidia_smi_output.txt
    sleep 1
done
EOF

chmod +x gpu_stress.sh
```

### 10.2 长时间稳定性测试
```bash
# 创建长时间运行的测试脚本
cat > long_term_test.sh << 'EOF'
#!/bin/bash

# 运行多个测试组合来模拟真实负载
echo "Starting long-term stability test..."

# 记录开始时间
START_TIME=$(date)

# 每隔一段时间运行不同的测试
for i in {1..100}; do
    echo "Running iteration $i at $(date)"
    
    # 运行一个小的计算任务
    ./sgemm_test &
    sleep 10
    
    # 运行内存带宽测试
    ./memory_bandwidth_test &
    sleep 10
    
    # 检查系统状态
    echo "System status at iteration $i:" >> stability_log.txt
    nvidia-smi >> stability_log.txt
    echo "---" >> stability_log.txt
    
    # 等待一段时间
    sleep 60
done

echo "Long-term test completed."
echo "Started at: $START_TIME"
echo "Ended at: $(date)"
EOF

chmod +x long_term_test.sh
```

## 11. 性能评估标准

### 11.1 A100性能参考标准

#### 理论峰值性能
- **FP32**: 19.5 TFLOPS (单精度)
- **TF32**: 156 TFLOPS (Tensor Float 32)
- **FP64**: 9.7 TFLOPS (双精度)
- **Tensor Core FP16**: 312 TFLOPS
- **Tensor Core BF16**: 312 TFLOPS
- **Tensor Core FP64**: 156 TFLOPS
- **显存带宽**: 1.6 TB/s (HBM2e)

#### 实测性能阈值
- **SGEMM (FP32)**: ≥18 TFLOPS (理想状态)
- **DGEMM (FP64)**: ≥9 TFLOPS (理想状态)
- **显存带宽**: ≥1.5 TB/s (理想状态)
- **NVLink带宽**: ≥300 GB/s (每对GPU间)

### 11.2 性能评估等级

#### 优秀 (A级)
- FP32性能达到理论值的90%以上
- 显存带宽达到理论值的90%以上
- 系统无异常温度或功耗波动
- AI模型推理性能符合预期

#### 良好 (B级)
- FP32性能达到理论值的80-89%
- 显存带宽达到理论值的80-89%
- 系统运行稳定，轻微性能波动
- AI模型推理性能基本符合预期

#### 合格 (C级)
- FP32性能达到理论值的70-79%
- 显存带宽达到理论值的70-79%
- 系统运行基本稳定
- AI模型推理性能略低于预期

#### 不合格 (F级)
- FP32性能低于理论值的70%
- 存在明显性能瓶颈或异常
- 系统不稳定或存在硬件问题

## 12. 测试报告模板

```markdown
# A100 GPU服务器性能测试报告

## 1. 硬件配置
- CPU: [型号及配置]
- GPU: NVIDIA A100 [规格]
- 内存: [容量及类型]
- 存储: [硬盘类型及容量]
- 网络: [网卡配置]

## 2. 系统环境
- 操作系统: [版本]
- 驱动版本: [版本号]
- CUDA版本: [版本号]
- 深度学习框架: [版本]

## 3. 性能测试结果

### 3.1 GPU性能
- FP32算力: [实测值] TFLOPS (理论值: 19.5 TFLOPS)
- 显存带宽: [实测值] GB/s (理论值: 1600 GB/s)
- NVLink带宽: [实测值] GB/s (理论值: 300 GB/s)

### 3.2 AI模型性能
- ResNet50推理延迟: [实测值] ms
- BERT模型吞吐量: [实测值] 句子/秒

### 3.3 系统稳定性
- 满载温度: [温度值] °C
- 功耗: [功耗值] W
- 稳定性测试时长: [时长] 小时

## 4. 评估结论
- 性能评级: [A/B/C/F级]
- 主要优势: [列出主要优势]
- 发现问题: [列出发现的问题]
- 优化建议: [提出优化建议]
```

## 13. 附录

### 13.1 常用nvidia-smi命令
```bash
# 查看详细GPU信息
nvidia-smi -q

# 查看实时性能指标
nvidia-smi dmon -s u -d 1

# 查看NVLink状态
nvidia-smi nvlink -s

# 重置GPU
sudo nvidia-smi -r -i 0
```

### 13.2 故障排除
- 如遇CUDA错误，检查驱动版本兼容性
- 如显存不足，减少测试数据大小
- 如温度过高，检查散热系统
- 如网络性能差，检查网卡配置和驱动