FROM centos:8
MAINTAINER Akira

RUN yum update -y

RUN yum -y install wget tar gzip gcc make expect

RUN mkdir /VolumeFile

RUN yum install epel-release -y

RUN yum install python36 -y

RUN python3 -m ensurepip

RUN pip3 install --upgrade pip

RUN pip3 install wheel

RUN pip3 install requests

RUN pip3 install beautifulsoup4

RUN pip3 install pysqlite3 --upgrade

RUN pip3 install apache-airflow

RUN export AIRFLOW_HOME=/VolumeFile

RUN airflow db init

RUN airflow users create -f Akira -l Chen -p Qoo_83367632 -u man4781747 -r Admin -e man4781747@gmail.com

CMD ["python3", "/VolumeFile/pythonCode/RunAirFlowServer.py"]