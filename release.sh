#!/bin/sh

DIR=`pwd`
host='root@172.17.30.21'
dstpath='/usr/local/zen'
buildpath='./.build/www'

[ -d ${buildpath} ] && rsync -az ${buildpath}/ ${host}:${dstpath}/

ssh ${host} "cd ${dstpath}/ && sh ctrl.sh restart >>./nohup.out 2>&1;"

echo '发布完成！';