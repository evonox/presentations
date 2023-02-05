#!/bin/bash -e

# Quick start-stop-daemon example, derived from Debian /etc/init.d/ssh

if [ "$EUID" -ne 0 ]
  then echo "Please run as root or using sudo..."
  exit
fi

set -e

SCRIPT_PATH=$(readlink -f $0)
SCRIPT_PATH=$(dirname $SCRIPT_PATH)

NAME=presentation-server
DIR=$SCRIPT_PATH
PID_PATH=/var/run/$NAME
PIDFILE=$PID_PATH/$NAME.pid
DAEMON=$(which node)
DAEMON_ARGS="$SCRIPT_PATH/index.js"
STOP_SIGNAL=INT
USER=user
LOG=/var/log/$NAME.log

export PATH="${PATH:+$PATH:}/usr/sbin:/sbin"

[ ! -d $PID_PATH ] && mkdir -p $PID_PATH


common_opts="--quiet --chuid $USER --pidfile $PIDFILE"

do_start(){
    start-stop-daemon --start $common_opts --chdir $DIR --make-pidfile --background --startas \
        /bin/bash -- -c "exec $DAEMON $DAEMON_ARGS" # > $LOG 2>&1"
}

do_stop(){
    opt=${@:-}
    start-stop-daemon --stop $common_opts --signal $STOP_SIGNAL --oknodo $opt --remove-pidfile
}

do_status(){
    start-stop-daemon --status $common_opts && exit_status=$? || exit_status=$?
    case "$exit_status" in
        0)
            echo "Program '$NAME' is running."
            ;;
        1)
            echo "Program '$NAME' is not running and the pid file exists."
            ;;
        3)
            echo "Program '$NAME' is not running."
            ;;
        4)
            echo "Unable to determine program '$NAME' status."
            ;;
    esac
}

case "$1" in
  status)
        do_status
        ;;
  start)
        echo -n "Starting daemon: "$NAME
        do_start
        echo "."
        ;;
  stop)
        echo -n "Stopping daemon: "$NAME
        do_stop
        echo "."
        ;;
  restart)
        echo -n "Restarting daemon: "$NAME
        do_stop --retry 30
        do_start
        echo "."
        ;;
  *)
        echo "Usage: "$1" {status|start|stop|restart}"
        exit 1
esac

exit 0