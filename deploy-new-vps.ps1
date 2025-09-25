# 新VPS部署脚本
# VPS信息: 23.94.61.101 (root/u5w9NGLWhn7r3cO2E5)

Write-Host "=== 开始在新VPS上部署SEO工具 ===" -ForegroundColor Green

# 创建临时的SSH命令文件
$sshCommands = @"
wget -O deploy-to-new-vps.sh https://raw.githubusercontent.com/billke971225/SEO-/master/deploy-to-new-vps.sh
chmod +x deploy-to-new-vps.sh
./deploy-to-new-vps.sh
"@

# 将命令保存到临时文件
$tempFile = "temp-ssh-commands.txt"
$sshCommands | Out-File -FilePath $tempFile -Encoding UTF8

Write-Host "正在连接到VPS并执行部署..." -ForegroundColor Yellow

# 使用SSH执行命令
try {
    # 方法1：直接执行单个命令
    Write-Host "步骤1: 下载部署脚本..." -ForegroundColor Cyan
    $result1 = ssh -o StrictHostKeyChecking=no root@23.94.61.101 "wget -O deploy-to-new-vps.sh https://raw.githubusercontent.com/billke971225/SEO-/master/deploy-to-new-vps.sh"
    
    Write-Host "步骤2: 设置执行权限..." -ForegroundColor Cyan
    $result2 = ssh -o StrictHostKeyChecking=no root@23.94.61.101 "chmod +x deploy-to-new-vps.sh"
    
    Write-Host "步骤3: 执行部署脚本..." -ForegroundColor Cyan
    $result3 = ssh -o StrictHostKeyChecking=no root@23.94.61.101 "./deploy-to-new-vps.sh"
    
    Write-Host "部署完成！" -ForegroundColor Green
    Write-Host "访问地址:" -ForegroundColor Yellow
    Write-Host "🌐 主服务: http://23.94.61.101:3000" -ForegroundColor White
    Write-Host "📊 仪表板: http://23.94.61.101:3001" -ForegroundColor White
    Write-Host "🔍 SEO分析器: http://23.94.61.101:3002" -ForegroundColor White
}
catch {
    Write-Host "部署过程中出现错误: $($_.Exception.Message)" -ForegroundColor Red
}
finally {
    # 清理临时文件
    if (Test-Path $tempFile) {
        Remove-Item $tempFile
    }
}

Write-Host "=== 部署脚本执行完成 ===" -ForegroundColor Green