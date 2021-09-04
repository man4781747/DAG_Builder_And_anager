import requests
import re

class airflowConnecter:
    def __init__(self,S_account, S_password, S_airflowURL="http://127.0.0.1:8080"):
        self.S_account = S_account
        self.S_password = S_password
        self.airflowURL = S_airflowURL
        self.S_datetimeReCheck = r"^\w{4}-\w{2}-\w{2}T\w{2}:\w{2}:\w{2}[+-]\w{2}:\w{2}$"
        
    def getDAGs(self):
        # https://airflow.apache.org/docs/apache-airflow/stable/stable-rest-api-ref.html#tag/DAG
        S_getDAGs_API = '{airflowURL}/api/v1/dags'.format(airflowURL=self.airflowURL)
        try:
            D_dags = requests.get(S_getDAGs_API, auth=(self.S_account, self.S_password)).json().get('dags')
            return D_dags
        except Exception as e:
            return {'status': 'Fail', 'message': str(e)}

    def getDAGBasicInfo(self, S_DAG_id):
        # https://airflow.apache.org/docs/apache-airflow/stable/stable-rest-api-ref.html#operation/get_dag
        S_getDAGBasicInfo = "{airflowURL}/api/v1/dags/{dag_id}".format(airflowURL=self.airflowURL,dag_id=S_DAG_id)
        try:
            D_dagBasicInfo = requests.get(S_getDAGBasicInfo, auth=(self.S_account, self.S_password)).json()
            return D_dagBasicInfo
        except Exception as e:
            return {'status': 'Fail', 'message': str(e)}

    def getDAGTasksInfo(self, S_DAG_id):
        # https://airflow.apache.org/docs/apache-airflow/stable/stable-rest-api-ref.html#operation/get_tasks
        S_getDAGTasks = "{airflowURL}/api/v1/dags/{dag_id}/tasks".format(airflowURL=self.airflowURL,dag_id=S_DAG_id)
        try:
            D_dagTasks = requests.get(S_getDAGTasks, auth=(self.S_account, self.S_password)).json()
            return D_dagTasks
        except Exception as e:
            return {'status': 'Fail', 'message': str(e)}

    def getDAGSourceCode(self, S_fileToken, encoding='utf-8'):
        # https://airflow.apache.org/docs/apache-airflow/stable/stable-rest-api-ref.html#operation/get_dag_source
        S_getDAGSourceCode = "{airflowURL}/api/v1/dagSources/{file_token}".format(airflowURL=self.airflowURL,file_token=S_fileToken)
        print(S_getDAGSourceCode)
        try:
            R_dagSourceCode = requests.get(S_getDAGSourceCode, auth=(self.S_account, self.S_password))
            R_dagSourceCode.encoding = encoding
            return {'content': R_dagSourceCode.text}
        except Exception as e:
            return {'status': 'Fail', 'message': str(e)}
    
    def getDAGRunsList(self, S_DAG_id, limit=100, offset=0, execution_date_gte='',execution_date_lte='',
    start_date_gte='',start_date_lte='',end_date_gte='',end_date_lte='',order_by=[]):
        # https://airflow.apache.org/docs/apache-airflow/stable/stable-rest-api-ref.html#tag/DAGRun
        #
        # datetime format example: 2021-09-02T06:00:00+08:00
        # re: \w{4}-\w{2}-\w{2}T\w{2}:\w{2}:\w{2}[+-]\w{2}:\w{2}
        #
        # https://airflow.apache.org/api/v1/dags/{dag_id}/dagRuns
        L_paras = []
        L_paras.append('limit={}'.format(limit))
        L_paras.append('offset={}'.format(offset))
        
        if re.search(self.S_datetimeReCheck, execution_date_gte):
            L_paras.append('execution_date_gte={}'.format(execution_date_gte))
            
        if re.search(self.S_datetimeReCheck, execution_date_lte):
            L_paras.append('execution_date_lte={}'.format(execution_date_lte))
            
        if re.search(self.S_datetimeReCheck, start_date_gte):
            L_paras.append('start_date_gte={}'.format(start_date_gte))
            
        if re.search(self.S_datetimeReCheck, start_date_lte):
            L_paras.append('start_date_lte={}'.format(start_date_lte))
            
        if re.search(self.S_datetimeReCheck, end_date_gte):
            L_paras.append('end_date_gte={}'.format(end_date_gte))
        
        if re.search(self.S_datetimeReCheck, end_date_lte):
            L_paras.append('end_date_lte={}'.format(end_date_lte))
        
        for S_orderByStr in order_by:
            L_paras.append('order_by={}'.format(S_orderByStr))
            
        S_parasString = '&'.join(L_paras)
        
        S_getDAGRunsList = "{airflowURL}/api/v1/dags/{dag_id}/dagRuns?{paras}".format(
            airflowURL=self.airflowURL,dag_id=S_DAG_id,paras=S_parasString
        )
        print(S_getDAGRunsList)
        try:
            D_dagRunsList = requests.get(S_getDAGRunsList, auth=(self.S_account, self.S_password)).json()
            return D_dagRunsList
        except Exception as e:
            return {'status': 'Fail', 'message': str(e)}
        
    def getDAGRunInfo(self, S_DAG_id, S_DAG_run_id):
        # https://airflow.apache.org/docs/apache-airflow/stable/stable-rest-api-ref.html#operation/get_dag_run
        
        S_getDAGRunIngo = "{airflowURL}/api/v1/dags/{dag_id}/dagRuns/{dag_run_id}".format(
            airflowURL=self.airflowURL,dag_id=S_DAG_id,dag_run_id=S_DAG_run_id
        )
        try:
            D_dagRunInfo = requests.get(S_getDAGRunIngo, auth=(self.S_account, self.S_password)).json()
            return D_dagRunInfo
        except Exception as e:
            return {'status': 'Fail', 'message': str(e)}
    
    def getImportErrors(self):
        # https://airflow.apache.org/docs/apache-airflow/stable/stable-rest-api-ref.html#operation/get_import_errors
        
        S_getImportErrors = "{airflowURL}/api/v1/importErrors".format(airflowURL=self.airflowURL)
        try:
            D_importErrors = requests.get(S_getImportErrors, auth=(self.S_account, self.S_password)).json()
            return D_importErrors
        except Exception as e:
            return {'status': 'Fail', 'message': str(e)}
        
if __name__ == '__main__':    
    S_airflowURL = 'http://127.0.0.1:8080'
    S_account = 'man4781747@gmail.com'
    S_password = 'Qoo_83367632'
    Obj_airflowConnecter = airflowConnecter(S_account, S_password,S_airflowURL)


    D_dags = Obj_airflowConnecter.getDAGs()[0]
    print(D_dags)

    D_dagBasicInfo = Obj_airflowConnecter.getDAGBasicInfo(D_dags.get('dag_id'))
    print(D_dagBasicInfo)

    D_dagTasksInfo = Obj_airflowConnecter.getDAGTasksInfo(D_dags.get('dag_id'))
    print(D_dagTasksInfo)

    D_dagSourceCode = Obj_airflowConnecter.getDAGSourceCode(D_dags.get('file_token'))
    print(D_dagSourceCode)

    D_dagRunsList = Obj_airflowConnecter.getDAGRunsList(
        D_dags.get('dag_id'),
        limit=10, offset=0,order_by=['-start_date']
    )
    print(D_dagRunsList.get('dag_runs'))

    D_DAGRunInfo = Obj_airflowConnecter.getDAGRunInfo(
        D_dags.get('dag_id'),
        D_dagRunsList.get('dag_runs')[0].get('dag_run_id')
    )
    print(D_DAGRunInfo)

