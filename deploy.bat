@echo off
echo 开始部署到GitHub Pages...

rem 构建项目
call npm run build

rem 进入构建目录
cd dist

rem 初始化git仓库
git init
git add -A
git commit -m "deploy"

rem 推送到gh-pages分支
git push -f git@github.com:changchangnie/ComputerDesign_DisplayBoard.git master:gh-pages

rem 返回原目录
cd ..