import datetime 
import time
import os
from airflow import DAG
from airflow.operators.dummy import DummyOperator
from airflow.operators.bash_operator import BashOperator
from airflow.operators.python import PythonOperator


default_args = {
    'owner': "Akira",
    'depends_on_past': False,
    'start_date': datetime.datetime(2021,9,1,15,5) - datetime.timedelta(hours=8),
    'email': ['man4781747@gmail.com'],
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': datetime.timedelta(minutes=60),
}

dag = DAG(
    dag_id='Test_4', 
    description='''國泰面試測試用DAG''',
    default_args=default_args,
    schedule_interval='* * 2 * *',
    catchup=False,
    tags=['buildByDAGBuilder'],
)

START = DummyOperator(
    task_id='START',
    dag=dag
)

END = DummyOperator(
    task_id='END',
    dag=dag
)
	
START >> END