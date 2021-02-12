#!/bin/sh
cd `dirname $0`
ROOT_PATH=`pwd`
a=`date -d "-$(date +%d) days + 1 month" +%d`
b=1
for i in `seq 1 $a`
do 
	date_avant=$(date --date="+$b days" +%F" "%T)
	b=$(($b + 1))
java -Dtalend.component.manager.m2.repository=$ROOT_PATH/../lib -Xms256M -Xmx1024M -cp .:$ROOT_PATH:$ROOT_PATH/../lib/routines.jar:$ROOT_PATH/../lib/crypto-utils.jar:$ROOT_PATH/../lib/dom4j-1.6.1.jar:$ROOT_PATH/../lib/log4j-1.2.17.jar:$ROOT_PATH/../lib/postgresql-42.2.5.jar:$ROOT_PATH/calendrier_0_1.jar: reporting_talend.calendrier_0_1.Calendrier  --context=Default "$@" --context_param jour="$date_avant"
done 