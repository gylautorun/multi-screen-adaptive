#!/bin/bash

# 部署脚本
set -e

echo "开始构建项目..."

# 安装依赖
pnpm install

# 构建项目
pnpm build

echo "构建完成，准备部署..."

# 部署目录（根据实际情况修改）
DEPLOY_DIR="./dist"

# 输出构建信息
echo "构建目录: $DEPLOY_DIR"
echo "文件数量: $(ls -la $DEPLOY_DIR | wc -l) 个"
echo "部署完成！请将 $DEPLOY_DIR 目录部署到静态服务器。"

# 可以在这里添加实际的部署命令，例如：
# rsync -avz --delete $DEPLOY_DIR/ user@server:/path/to/web/root/
# 或者其他部署方式