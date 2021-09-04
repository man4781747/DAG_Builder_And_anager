console.log("stats Test")

var PythonOperator_Default_Index = 1
var BashOperator_Default_Index = 1
var RunPythonFile_Default_Index = 1
var nowDatetime = new Date()

function _uuid() {
  var d = Date.now();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
    d += performance.now(); //use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

function addz(num){
	return num < 10 ? "0" + num : num
}

Vue.component("bash-operator-item", {
    template:`
        <div class="dag_item">
			<div>
			{{index}}
				<p>bash-operator-item</p>
				<button @click="$emit('item-up', index)" v-show="index != 0">▲</button>
				<button @click="$emit('item-down', index)" v-show="index != max_index">▼</button>
				<button @click="$emit('delete-item', post.uuid)">X</button>
			</div>
			<div  class="input_area">
				<label>Task ID:</label><input v-on:input="dag_code" v-model="post.tesk_id" placeholder="請輸入">
			</div>
			<div  class="input_area">
            <label>Bash Command:</label><input v-on:input="dag_code" v-model="post.bash_command" placeholder="請輸入">
			</div>
		</div>
        
    `,
    props: ['post', 'index', 'max_index'],
    methods: {
        dag_code: function(){
            let return_string = this.post.tesk_id+` = BashOperator(
    task_id='`+this.post.tesk_id+`',
    bash_command='`+this.post.bash_command+`',
    dag=dag)
	
`
			Vue.set(this.post, "code", return_string)
			// this.post["code"] = return_string
			// this.$emit('update', {'uuid': this.post.uuid})
			// return this.post["code"]
		},
	}
})

Vue.component("run-python-file-item", {
    template:`
        <div class="dag_item">
			<div>
			{{index}}
				<p>run-python-file-item</p>
				<button @click="$emit('item-up', index)" v-show="index != 0">▲</button>
				<button @click="$emit('item-down', index)" v-show="index != max_index">▼</button>
				<button @click="$emit('delete-item', post.uuid)">X</button>
			</div>
			<div  class="input_area">
				<label>Task ID:</label><input v-on:input="dag_code" v-model="post.tesk_id" placeholder="請輸入">
			</div>
			<div  class="input_area">
				<label>Python File Name:</label><input v-on:input="dag_code" v-model="post.python_file_name" placeholder="請輸入">
			</div>
			<div  class="input_area">
				<label>Command:</label><input v-on:input="dag_code" v-model="post.python_file_command" placeholder="請輸入">
			</div>
		</div>
        
    `,
    props: ['post', 'index', 'max_index'],
    methods: {
        dag_code: function(){
            let return_string = this.post.tesk_id+` = PythonOperator(
    task_id='`+this.post.tesk_id+`',
    python_callable=RunPythonFile,
    op_kwargs={'S_filename':"`+this.post.python_file_name+`",'S_command_argvs':"`+this.post.python_file_command+`"},
    dag=dag)
	
`
			Vue.set(this.post, "code", return_string)
		},
	}
})

Vue.component("python-operator-item", {
	data: function () {
		return {
			"paras_save" : {},
		}
	},
    template:`
        <div class="dag_item">
			<div>
			{{index}}
				<p>python-operator-item</p>
				<button @click="$emit('item-up', index)" v-show="index != 0">▲</button>
				<button @click="$emit('item-down', index)" v-show="index != max_index">▼</button>
				<button @click="$emit('delete-item', post.uuid)">X</button>
			</div>
            <div  class="input_area">
			<label>Task ID:</label><input v-on:input="dag_code" v-model="post.tesk_id" placeholder="請輸入">
            </div>
			<div  class="input_area">
			<label>Python Code:</label><textarea v-on:change="dag_code" v-model="post.python_code"></textarea>
			</div>
			<div v-for="(item, index) in getFunctionInfo.paras">
				<label>{{item}}:</label><input v-on:input="dag_code" v-model="paras_save[item]">
			</div>
        </div>
        
    `,
    props: ['post', 'index', 'max_index'],
    methods: {
        dag_code: function(){
            let return_string = this.post.python_code +'\n\n'+ this.post.tesk_id+` = PythonOperator(
    task_id='`+this.post.tesk_id+`',
    python_callable=`+this.getFunctionInfo.functionName+`,
    op_kwargs=`+this.para_string+`,
    dag=dag)
	
`
			Vue.set(this.post, "code", return_string)
		},
	},
	
	computed: {
		getFunctionInfo(){
			let D_infos = {"paras":[], "functionName":""}
			let re_list = this.post.python_code.match(/def +(.*)\((.*)\):/)
			try {
				D_infos["functionName"] = re_list[1]
				let paras = re_list[2].split(',')
				for (para of paras) {
					// console.log(para)
					let S_keyName = para.replace(/(^\s*)|(\s*$)/g, "")
					if (this.paras_save.hasOwnProperty(S_keyName) == false){
						Vue.set(this.paras_save, S_keyName, "")
					}
					D_infos["paras"].push(S_keyName)
				}
					
			} catch {}
			
			return D_infos
		},
		
		para_string(){
			let S_paraString = "{"
			for (S_key of this.getFunctionInfo["paras"]) {
				S_paraString = S_paraString + '"' + S_key + '":' + this.paras_save[S_key] + ','
			}
			S_paraString = S_paraString + '}'
			return S_paraString
		},
	},
})

var VueSetting = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
	dag_item_list: ["PythonOperator", "BashOperator", "RunPythonFile"],
	dag_item_chose : null,
	airflow_mainpage_url : "http://127.0.0.1:8080/home?status=active",
	dag_item_build_list : {},
	dag_item_build_index : [],
	ownerValues : "Default_owner",
	start_date: nowDatetime.getFullYear() + "-" + addz(nowDatetime.getMonth()+1) + "-" + addz(nowDatetime.getDate()),
	start_time: addz(nowDatetime.getHours()) + ":" + addz(nowDatetime.getMinutes()),
	scheduleValues : "*/5 * * * *",
	dagIdValue: "Default_dag_id",
	dagDescriptionValue: "Description",
  },
  
  computed: {
	DAGFileString(){
		let DAGFileString_return = `
import datetime 
import time
import os
from airflow import DAG
from airflow.operators.dummy import DummyOperator
from airflow.operators.bash_operator import BashOperator
from airflow.operators.python import PythonOperator

def RunPythonFile(S_filename, S_command_argvs):
    S_fileFullName = os.path.join(os.path.split(os.path.realpath(__file__))[0], S_filename)
    os.system("python3 {} {}".format(S_fileFullName, S_command_argvs))

default_args = {
    'owner': "`+ this.ownerValues +`",
    'depends_on_past': False,
    'start_date': datetime.datetime(`+this.GetStartDateString+`) - datetime.timedelta(hours=8),
    'email': ['man4781747@gmail.com'],
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': datetime.timedelta(minutes=60),
}

dag = DAG(
    dag_id='`+this.dagIdValue+`', 
    description='''`+this.dagDescriptionValue+`''',
    default_args=default_args,
    schedule_interval='`+this.scheduleValues+`',
    catchup=False,
)

START = DummyOperator(
    task_id='START',
    dag=dag
)

END = DummyOperator(
    task_id='END',
    dag=dag
)

`
		var taskIdList = [];
		for (dagItemKey of this.dag_item_build_index){
			console.log(dagItemKey)
			taskIdList.push(this.dag_item_build_list[dagItemKey]['tesk_id'])
			DAGFileString_return = DAGFileString_return + this.dag_item_build_list[dagItemKey]['code']
		}
		
		
		DAGFileString_return = DAGFileString_return + "START >> " + taskIdList.join(" >> ") + ">> END"
		
		return DAGFileString_return
		
	},
	// GetNewData(){return this.dag_item_build_list},
    GetStartDateString(){
		let DateStringList = this.start_date.split('-')
		let TimeStringList = this.start_time.split(':')
		let timeList = []
		for (dateItemChose of DateStringList){
			timeList.push(parseInt(dateItemChose))
		}
		for (dateItemChose of TimeStringList) {
			timeList.push(parseInt(dateItemChose))
		}
		
		return timeList.join(',')
	},
  },
  
  methods: {
	BuildNewDAGItem: function(S_itemName) {
		console.log(S_itemName)
		if (S_itemName == "BashOperator"){
			let uuid = _uuid()
			Vue.set(
				this.dag_item_build_list,
				uuid,
				{
					uuid: uuid,
					type: "BashOperator",
					tesk_id: "BashOperator_Default_"+BashOperator_Default_Index,
					bash_command : "",
				}
			)
			this.dag_item_build_index.push(uuid)
			BashOperator_Default_Index += 1
		} else if (S_itemName == "PythonOperator"){
			let uuid = _uuid()
			Vue.set(
				this.dag_item_build_list,
				uuid,
				{
					uuid: uuid,
					type: "PythonOperator",
					tesk_id: "PythonOperator_Default_"+PythonOperator_Default_Index,
					python_code : "",
				}
			)
			this.dag_item_build_index.push(uuid)
			PythonOperator_Default_Index += 1
		} else if (S_itemName == "RunPythonFile"){
			let uuid = _uuid()
			Vue.set(
				this.dag_item_build_list,
				uuid,
				{
					uuid: uuid,
					type: "RunPythonFile",
					tesk_id: "RunPythonFile_"+PythonOperator_Default_Index,
					python_file_name : "",
					python_file_command : "",
				}
			)
			this.dag_item_build_index.push(uuid)
			RunPythonFile_Default_Index += 1
		}
	},
	
	item_up: function(index){
		let TempData = this.dag_item_build_index[index-1]
		Vue.set(this.dag_item_build_index, index-1, this.dag_item_build_index[index])
		Vue.set(this.dag_item_build_index, index, TempData)
	},
	
	item_down: function(index){
		let TempData = this.dag_item_build_index[index+1]
		Vue.set(this.dag_item_build_index, index+1, this.dag_item_build_index[index])
		Vue.set(this.dag_item_build_index, index, TempData)
	},
	
	DelDAGItemByUuid(S_uuid){
		console.log("del : "+S_uuid)
		Vue.delete(
			this.dag_item_build_list,
			S_uuid
		)
		let index = this.dag_item_build_index.indexOf(S_uuid);
		if (index > -1) {
			  this.dag_item_build_index.splice(index, 1);
			}
	},
	
	UpdateDAGFileString(D_uuid){
		console.log(D_uuid)
	},
  }
})

function clickDownload(aLink)
{
	str =  encodeURIComponent(VueSetting.DAGFileString.replace(/(^\s*)|(\s*$)/g, ""));
	aLink.href = "data:text/csv;charset=utf-8,"+str;
}