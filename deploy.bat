@echo off
echo Starting to deploy to GitHub Pages...

rem 添加变更
git add .
git commit -m "1"
git push -u origin master

rem 构建项目
call npm run build

rem 进入构建目录
cd dist

rem 初始化 git 仓库
git init
git add -A
git commit -m "deploy"

rem 推送到 GitHub 用户的 gh-pages 分支
git push -f git@github.com:changchangnie/changchangnie.github.io.git master:gh-pages

rem 返回原目录
cd ..
