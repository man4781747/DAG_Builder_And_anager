var PythonOperator_Default_Index = 1
var BashOperator_Default_Index = 1
var RunPythonFile_Default_Index = 1
var nowDatetime = new Date()


// const prettyPrint = require('code-prettify');

// ############################################################
// ######################  通用function  ######################
// ############################################################

function _uuid(){
	// 計算隨機的UUID當作唯一Key
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
	// 小於10數值前方補0
	return num < 10 ? "0" + num : num
}

function compareNumbers(a, b) {
	return a - b;
}

// ############################################################
// ###################### 自訂義模組區塊 ######################
// ############################################################

// bash-operator-item 模組設定
Vue.component("bash-operator-item", {
    template:`
        <div class="dag_item">
			<div>
				<button @click="$emit('item-up', index)" v-show="index != 0">▲</button>
				<button @click="$emit('item-down', index)" v-show="index != max_index">▼</button>
				<button @click="$emit('delete-item', post.uuid)">X</button>
			</div>
			<div  class="input_area">
				<label class="input_area_label">Task ID:</label><input v-on:input="dag_code" v-model="post.tesk_id" placeholder="請輸入">
			</div>
			<div  class="input_area">
				<label class="input_area_label">Bash Command:</label><input v-on:input="dag_code" v-model="post.bash_command" placeholder="請輸入">
			</div>
		</div>
    `,
    props: ['post', 'index', 'max_index'],
    methods: {
        dag_code: function(){
            let return_string = this.post.tesk_id+` = BashOperator(
    task_id='`+this.post.tesk_id+`',
    bash_command='`+this.post.bash_command+`',
    dag=dag,
    trigger_rule=TriggerRule.ALL_DONE
    )
	
`
			Vue.set(this.post, "code", return_string)
		},
	},
	created: function() { 
		this.dag_code()
	},
})

// run-python-file-item 模組設定(已停用)
// Vue.component("run-python-file-item", {
    // template:`
        // <div class="dag_item">
			// <div>
			// {{index}}
				// <p>run-python-file-item</p>
				// <button @click="$emit('item-up', index)" v-show="index != 0">▲</button>
				// <button @click="$emit('item-down', index)" v-show="index != max_index">▼</button>
				// <button @click="$emit('delete-item', post.uuid)">X</button>
			// </div>
			// <div  class="input_area">
				// <label>Task ID:</label><input v-on:input="dag_code" v-model="post.tesk_id" placeholder="請輸入">
			// </div>
			// <div  class="input_area">
				// <label>Python File Name:</label><input v-on:input="dag_code" v-model="post.python_file_name" placeholder="請輸入">
			// </div>
			// <div  class="input_area">
				// <label>Command:</label><input v-on:input="dag_code" v-model="post.python_file_command" placeholder="請輸入">
			// </div>
		// </div>
        
    // `,
    // props: ['post', 'index', 'max_index'],
    // methods: {
        // dag_code: function(){
            // let return_string = this.post.tesk_id+` = PythonOperator(
    // task_id='`+this.post.tesk_id+`',
    // python_callable=RunPythonFile,
    // op_kwargs={'S_filename':"`+this.post.python_file_name+`",'S_command_argvs':"`+this.post.python_file_command+`"},
    // dag=dag)
			// Vue.set(this.post, "code", return_string)
		// },
	// }
// })

// python-operator-item 模組設定(已停用)
// Vue.component("python-operator-item", {
	// data: function () {
		// return {
			// "paras_save" : {},
		// }
	// },
    // template:`
        // <div class="dag_item">
			// <div>
			// {{index}}
				// <p>python-operator-item</p>
				// <button @click="$emit('item-up', index)" v-show="index != 0">▲</button>
				// <button @click="$emit('item-down', index)" v-show="index != max_index">▼</button>
				// <button @click="$emit('delete-item', post.uuid)">X</button>
			// </div>
            // <div  class="input_area">
			// <label>Task ID:</label><input v-on:input="dag_code" v-model="post.tesk_id" placeholder="請輸入">
            // </div>
			// <div  class="input_area">
			// <label>Python Code:</label><textarea v-on:change="dag_code" v-model="post.python_code"></textarea>
			// </div>
			// <div v-for="(item, index) in getFunctionInfo.paras">
				// <label>{{item}}:</label><input v-on:input="dag_code" v-model="paras_save[item]">
			// </div>
        // </div>
        
    // `,
    // props: ['post', 'index', 'max_index'],
    // methods: {
        // dag_code: function(){
            // let return_string = this.post.python_code +'\n\n'+ this.post.tesk_id+` = PythonOperator(
    // task_id='`+this.post.tesk_id+`',
    // python_callable=`+this.getFunctionInfo.functionName+`,
    // op_kwargs=`+this.para_string+`,
    // dag=dag)
	
// `
			// Vue.set(this.post, "code", return_string)
		// },
	// },
	// computed: {
		// getFunctionInfo(){
			// let D_infos = {"paras":[], "functionName":""}
			// let re_list = this.post.python_code.match(/def +(.*)\((.*)\):/)
			// try {
				// D_infos["functionName"] = re_list[1]
				// let paras = re_list[2].split(',')
				// for (para of paras) {
					// let S_keyName = para.replace(/(^\s*)|(\s*$)/g, "")
					// if (this.paras_save.hasOwnProperty(S_keyName) == false){
						// Vue.set(this.paras_save, S_keyName, "")
					// }
					// D_infos["paras"].push(S_keyName)
				// }
			// } catch {}
			// return D_infos
		// },
		// para_string(){
			// let S_paraString = "{"
			// for (S_key of this.getFunctionInfo["paras"]) {
				// S_paraString = S_paraString + '"' + S_key + '":' + this.paras_save[S_key] + ','
			// }
			// S_paraString = S_paraString + '}'
			// return S_paraString
		// },
	// },
// })

// ############################################################
// ######################  Vue App 區塊  ######################
// ############################################################

var VueSetting = new Vue({
	el: '#app',
	data: {
		// 基礎資訊
		DAGpyFileName : "DefaultFileName.py",
		ownerValues : "Default_owner",
		dagIdValue: "Default_dag_id",		
		scheduleValues : "*/5 * * * *",
		template_searchpath: "",
		dagDescriptionValue: "請輸入註解",
		code: "console.log('hello world')",
		// cron 時間設定相關參數
		D_cronDataSetting: {
			'Month': {
				cronType: '1',
				cronCollect: [],
				cron_Value: 1,
				maxValue: 12,
				windowShow: false,
				valueBias: 1,
				maxLength: 12,
			},
			'Day': {
				cronType: '1',
				cronCollect: [],
				cron_Value: 1,
				maxValue: 31,
				windowShow: false,
				valueBias: 1,
				maxLength: 31,
			},
			'Hour': {
				cronType: '1',
				cronCollect: [],
				cron_Value: 1,
				maxValue: 23,
				windowShow: false,
				valueBias: 0,
				maxLength: 24,
			},
			'Minute' : {
				cronType: '1',
				cronCollect: [],
				cron_Value: 1,
				maxValue: 59,
				windowShow: false,
				valueBias: 0,
				maxLength: 60,
			},
		},
		cronWeekDayCollect: [0,1,2,3,4,5,6],
		weekdayChinese: {
			'0' : '日',
			'1' : '一',
			'2' : '二',
			'3' : '三',
			'4' : '四',
			'5' : '五',
			'6' : '六',
			'7' : '日',
		},
		
		// task 視窗物件相關參數
		dag_item_build_list : {},  // 負責各DAG tasks 的詳細內容
		dag_item_build_index : [], // 負責各DAG tasks 的排列順序

		// Misc.
		EmptyDAGSettingWindowClass: '', // 控制拉動放置檔案空間的style (之後可能會拿掉)
		uploadFileList: {},             // 上傳附件清單
		DAGpythonFileUploadStatue: "",  // 負責上傳狀態的顯示文字 (之後應該要移到 computed區塊比較正確)

		// ### 已停用的參數，但可能日後會需要使用因此當做紀錄
		// dag_item_list: ["PythonOperator", "BashOperator", "RunPythonFile"], // 紀錄可以選的 DAG tasks物件 (已停用)
		// dag_item_chose : null,
		// start_date: nowDatetime.getFullYear() + "-" + addz(nowDatetime.getMonth()+1) + "-" + addz(nowDatetime.getDate()),
		// start_time: addz(nowDatetime.getHours()) + ":" + addz(nowDatetime.getMinutes()),
  },
  
	computed: {
		DAGFileString(){
			let DAGFileString_return = `
import os
import shutil
import pendulum
form datetime import datetime, timedelta
import airflow
from airflow.utils import timezone
from airflow import DAG
from airflow.operators.bash_operator import BashOperator
from airflow.utils.trigger_rule import TriggerRule

now = timezone.utcnow
local_tz = pendulum.timezone('Asia/Taipei')

default_args = {
	'owner': "`+ this.ownerValues +`",
	'email': ['leekaiping@cathaylife.com.tw'],
	'email_on_failure': False,
	'email_on_retry': False,
	'depends_on_past': False,
	'start_date': (now() - timedelta(day=1)).replace(tzinfo-local_tz),
	'retries': 1,
	'retry_delay': timedelta(hours=1),
}

dag = DAG(
	dag_id='`+this.dagIdValue+`', 
	description='''`+this.dagDescriptionValue+`''',
	default_args=default_args,
	schedule_interval='`+this.cronStringGet+`',
	catchup=False,
	template_searchpath='` + this.template_searchpath + `'
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

`
			var taskIdList = [];
			for (dagItemKey of this.dag_item_build_index){
				console.log(dagItemKey)
				taskIdList.push(this.dag_item_build_list[dagItemKey]['tesk_id'])
				DAGFileString_return = DAGFileString_return + this.dag_item_build_list[dagItemKey]['code']
			}
			
			
			DAGFileString_return = DAGFileString_return + "START >> " + taskIdList.join(" >> ") + ">> END"
			DAGFileString_return = DAGFileString_return.trim()
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
	
		cornMonth (){
			if (this.D_cronDataSetting['Month'].cronType=='1'){
				if (this.D_cronDataSetting['Month'].cronCollect.length == 0){
					return '*'
				} else if (
					this.D_cronDataSetting['Month'].cronCollect.length == this.D_cronDataSetting['Month'].maxLength
				){
					return '*'
				}
				return this.D_cronDataSetting['Month'].cronCollect.sort(compareNumbers).join(',')
			} else {
				if (this.D_cronDataSetting['Month'].cron_Value==1){
					return "*"
				}
				return "*/"+this.D_cronDataSetting['Month'].cron_Value
			}
		},
		
		cornDay (){
			if (this.D_cronDataSetting['Day'].cronType=='1'){
				if (this.D_cronDataSetting['Day'].cronCollect.length == 0){
					return '*'
				} else if (
					this.D_cronDataSetting['Day'].cronCollect.length == this.D_cronDataSetting['Day'].maxLength
				){
					return '*'
				}
				return this.D_cronDataSetting['Day'].cronCollect.sort(compareNumbers).join(',')
			} else {
				if (this.D_cronDataSetting['Day'].cron_Value==1){
					return "*"
				}
				return "*/"+this.D_cronDataSetting['Day'].cron_Value
			}
		},
		
		cornHour (){
			if (this.D_cronDataSetting['Hour'].cronType=='1'){
				if (this.D_cronDataSetting['Hour'].cronCollect.length == 0){
					return '*'
				} else if (
					this.D_cronDataSetting['Hour'].cronCollect.length == this.D_cronDataSetting['Hour'].maxLength
				){
					return '*'
				}
				return this.D_cronDataSetting['Hour'].cronCollect.sort(compareNumbers).join(',')
			} else {
				if (this.D_cronDataSetting['Hour'].cron_Value==1){
					return "*"
				}
				return "*/"+this.D_cronDataSetting['Hour'].cron_Value
			}
		},
		
		cornMinute (){
			if (this.D_cronDataSetting['Minute'].cronType=='1'){
				if (this.D_cronDataSetting['Minute'].cronCollect.sort(compareNumbers).length == 0){
					return '*'
				} else if (
					this.D_cronDataSetting['Minute'].cronCollect.length == this.D_cronDataSetting['Minute'].maxLength
				){
					return '*'
				}
				return this.D_cronDataSetting['Minute'].cronCollect.join(',')
			} else {
				if (this.D_cronDataSetting['Minute'].cron_Value==1){
					return "*"
				}
				return "*/"+this.D_cronDataSetting['Minute'].cron_Value
			}
		},
		
		cornWeekday (){
			if (this.cronWeekDayCollect.length==0 | this.cronWeekDayCollect.length==7){
				return '*'
			}
			return this.cronWeekDayCollect.sort(compareNumbers).join(',').replace('0', '7')
		},
		
		cronWeekDayCollectSet() {
			if (this.cronWeekDayCollect.length==0){
				return new Set([1,2,3,4,5,6,7])
			}
			return new Set(this.cronWeekDayCollect)
		},
		
		cronStringGet(){
			return this.cornMinute+' '+this.cornHour+' '+this.cornDay+' '+this.cornMonth+' '+this.cornWeekday
		},
		
		perViewCronDatetime(){
			// 計算月份清單
			if (this.D_cronDataSetting['Month'].cronType=='2'){
				var monthList = []
				for (let i=1;i<=12;i=i+parseInt(
					this.D_cronDataSetting['Month'].cron_Value
				)){
					monthList.push(i)
				}
			} else {
				if (this.D_cronDataSetting['Month'].cronCollect.length == 0){
					var monthList = [...Array(13).keys()].slice(1)
				} else {
					var monthList = this.D_cronDataSetting['Month'].cronCollect
				}
			}
			console.log('Month Chose: '+monthList)
			
			// 計算日期清單
			if (this.D_cronDataSetting['Day'].cronType=='2'){
				var dayList = []
				for (let i=1;i<=31;i=i+parseInt(
					this.D_cronDataSetting['Day'].cron_Value
				)){
					dayList.push(i)
				}
			} else {
				if (this.D_cronDataSetting['Day'].cronCollect.length == 0){
					var dayList = [...Array(32).keys()].slice(1)
				} else {
					var dayList = this.D_cronDataSetting['Day'].cronCollect
				}
			}
			console.log('Day Chose: '+dayList)

			// 計算小時清單
			if (this.D_cronDataSetting['Hour'].cronType=='2'){
				var hourList = []
				for (let i=0;i<=23;i=i+parseInt(
					this.D_cronDataSetting['Hour'].cron_Value
				)){
					hourList.push(i)
				}
			} else {
				if (this.D_cronDataSetting['Hour'].cronCollect.length == 0){
					var hourList = [...Array(24).keys()]
				} else {
					var hourList = this.D_cronDataSetting['Hour'].cronCollect
				}
			}
			console.log('Hour Chose: '+hourList)
			
			if (this.D_cronDataSetting['Minute'].cronType=='2'){
				var miunteList = []
				for (let i=0;i<=59;i=i+parseInt(
					this.D_cronDataSetting['Minute'].cron_Value
				)){
					miunteList.push(i)
				}
			} else {
				if (this.D_cronDataSetting['Minute'].cronCollect.length == 0){
					var miunteList = [...Array(60).keys()]
				} else {
					var miunteList = this.D_cronDataSetting['Minute'].cronCollect
				}
			}
			console.log('Minute Chose: '+miunteList)
			
			var dateItem
			var dataList = []
			var nowDatetime = new Date()
			var nowYear = nowDatetime.getFullYear()
			var nowTime = nowDatetime.getTime()
			
			for (let yearChose of [nowYear, nowYear+1, nowYear+2, nowYear+3, nowYear+4]){
				for (let monthChose of monthList){
					for (let dayChose of dayList){
						dateItem = new Date()
						dateItem.setYear(yearChose)
						dateItem.setDate(dayChose)
						dateItem.setMonth(monthChose-1)
						if (dateItem.getTime() < nowTime){
							continue
						}
						for (let hourChose of hourList){
							for (let miunteChose of miunteList){
								dateItem.setHours(hourChose)
								dateItem.setMinutes(miunteChose)
								if (
									dateItem.getMonth() == monthChose-1 &
									dateItem.getTime() >= nowTime &
									this.cronWeekDayCollectSet.has(dateItem.getDay())
								){
									dataList.push(dateItem.format("(w) yyyy-MM-dd hh:mm"))
									console.log(dateItem.format("(w) yyyy-MM-dd hh:mm"))
								}
								if (dataList.length >= 11){break}
							}
							if (dataList.length >= 11){break}
						}
						if (dataList.length >= 11){break}
					}
					if (dataList.length >= 11){break}
				}
				if (dataList.length >= 11){break}
			}
			return dataList
		},
		
		uploadFiles(){
			return Object.keys(this.uploadFileList)
		},
  },
  
  methods: {
	BuildNewDAGItem: function(S_itemName, S_tesk_id, S_bash_command) {
		console.log(S_itemName)
		if (S_itemName == "BashOperator"){
			let uuid = _uuid()
			if (S_tesk_id == null){
				S_tesk_id = "BashOperator_Default_"+BashOperator_Default_Index
			}
			
			
			Vue.set(
				this.dag_item_build_list,
				uuid,
				{
					uuid: uuid,
					type: "BashOperator",
					tesk_id: S_tesk_id,
					bash_command : S_bash_command,
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
	
	switchCronType(S_witchCron){
		if (this.D_cronDataSetting[S_witchCron].cronType == '1'){
			this.D_cronDataSetting[S_witchCron].cronType = '2'
		} else {
			this.D_cronDataSetting[S_witchCron].cronType = '1'
		}
	},
	
	switchCronChangeWindow(S_cronType){
		console.log(this.D_cronDataSetting[S_cronType].windowShow)
		this.D_cronDataSetting[S_cronType].windowShow = !this.D_cronDataSetting[S_cronType].windowShow
	},
	
	GetDAGsettingCSV(file){
		console.log(file);
		if (this.dag_item_build_index.length != 0){
			var ifDelAllDAGStages = confirm('要清空現有的 Stages 嗎?');
			if (ifDelAllDAGStages) {
				this.clearAllDAGStaegs()
			} else {
			}
		}
		
		
		let reader = new FileReader();
		reader.onload = function () {
			let L_csvData = this.result.split(/[\r\n]+/g)
			for (csvLineItem of L_csvData.slice(1)){
				if (csvLineItem){
					L_lineData = csvLineItem.split(/[\t\r,]+/g)
					VueSetting.BuildNewDAGItem('BashOperator', L_lineData[0], L_lineData[1])
				}
			}
		};
		reader.readAsText(file);
	},
	
	clearAllDAGStaegs(){
		while (this.dag_item_build_index.length != 0){
			this.DelDAGItemByUuid(this.dag_item_build_index[0])
		}
	},
	
	inputTest(files){
		test = files
		for (let fileChose of files){
			Vue.set(
				VueSetting.uploadFileList,
				fileChose.name + fileChose.size + fileChose.type,
				{
					'status': 'Wait To Load',
					'content' : "",
					'fileBlob' : fileChose,
					'styleSet' : 'background-color: #a7aeae;',
				}
			)
		}
		
		var fileIndex = 0
		function readFile(fileIndexInput) {
			if (fileIndexInput >=  files.length){
				return null
			}
			var file = files[fileIndexInput]
			var S_fileKey = file.name + file.size + file.type
			var reader = new FileReader();  
			reader.onload = function (e) {
				let S_content = this.result
				VueSetting.uploadFileList[S_fileKey]['content'] = S_content
				VueSetting.uploadFileList[S_fileKey]['status'] = "Load Done! Wait for upload to server."
				readFile(fileIndexInput+1)
			}
			VueSetting.uploadFileList[S_fileKey]['status'] = "Loading..."
			reader.readAsText(file);			
		}
		readFile(fileIndex)
	},
	
	delUploadFile(S_md5){
		Vue.delete(this.uploadFileList, S_md5)
	},
	
	uploadFilesToServer(){
		for (let S_fileKey in this.uploadFileList){
			if (this.uploadFileList[S_fileKey].status == 'Load Done! Wait for upload to server.'){
				let form = new FormData();
				form.append("fileUploaded", this.uploadFileList[S_fileKey]['fileBlob'])
				form.append("fileName", this.uploadFileList[S_fileKey]['fileBlob'].name)
				form.append("fileKey", S_fileKey)
				fetch('http://127.0.0.1:8000/AirFlowUploadWeb/UploadFile/', {
					method: 'POST',
					body: form,
				}).then(function(response) {
					return response.json();
				})
				.then(function(myJson) {
					console.log(myJson);
					VueSetting.uploadFileList[myJson['fileKey']]['status'] = myJson['Result']
					if (myJson['Result'] == 'success'){
						VueSetting.uploadFileList[S_fileKey]['styleSet'] = 'background-color: #4ba831;'
					} else {
						VueSetting.uploadFileList[S_fileKey]['styleSet'] = 'background-color: #ff5050;'
					}
				});
				this.uploadFileList[S_fileKey]['status'] = 'Upload To Server ING...'
				this.uploadFileList[S_fileKey]['styleSet'] = 'background-color: #ffe699;'
			}
		}
		
		let DAGpyFileform = new FormData();
		DAGpyFileform.append("DAGpyFileName", this.DAGpyFileName)
		DAGpyFileform.append("DAGpyFileContent", this.DAGFileString)
		fetch('http://127.0.0.1:8000/AirFlowUploadWeb/UploadDAGPythonFile/', {
			method: 'POST',
			body: DAGpyFileform,
		}).then(function(response) {
			return response.json();
		})
		.then(function(myJson) {
			console.log(myJson);
			if (myJson['Result'] == 'success'){
				VueSetting.DAGpythonFileUploadStatue = VueSetting.DAGpyFileName +" 上傳完畢"
			} else {
				VueSetting.DAGpythonFileUploadStatue = VueSetting.DAGpyFileName +" 上傳失敗，失敗原因: "+myJson['Result']
					}
		});
		this.DAGpythonFileUploadStatue = this.DAGpyFileName +" 上傳中"
		
	},
	
	allSwitchButtonClick(S_type){
		if (this.D_cronDataSetting[S_type].cronCollect.length != this.D_cronDataSetting[S_type].maxValue + 1 - this.D_cronDataSetting[S_type].valueBias){
			this.D_cronDataSetting[S_type].cronCollect = [...Array(this.D_cronDataSetting[S_type].maxValue+1).keys()].slice(
				this.D_cronDataSetting[S_type].valueBias
			)
		} else {
			this.D_cronDataSetting[S_type].cronCollect = []
		}
	},
	
	highlighter(code) {
	// js highlight example
		return Prism.highlight(code, Prism.languages.python, "py");
	},
  },
  
	mounted() {
		this.$refs.select_frame.ondragleave = (e) => {
		  e.preventDefault();  //阻止離開時的瀏覽器預設行為
		  VueSetting.EmptyDAGSettingWindowClass = ''
		  console.log('拉離開了')
		},
		
		this.$refs.select_frame.ondrop = (e) => {
			VueSetting.EmptyDAGSettingWindowClass = ''
			e.preventDefault();    //阻止拖放後的瀏覽器預設行為
			const data = e.dataTransfer.files;  // 獲取檔案物件
			if (data.length < 1) {
			return;  // 檢測是否有檔案拖拽到頁面     
			}
			console.log(e.dataTransfer.files);
			const formData = new FormData();
			for (let i = 0; i < e.dataTransfer.files.length; i++) {
			console.log(e.dataTransfer.files[i]);
			if (e.dataTransfer.files[i].name.indexOf('csv') === -1) {
			  alert('只允許上傳.csv檔案');
			  return;
			}
			formData.append('uploadfile', e.dataTransfer.files[i], e.dataTransfer.files[i].name);
			}
			console.log(e.dataTransfer.files[0]);
			VueSetting.GetDAGsettingCSV(e.dataTransfer.files[0])
		};
			
		this.$refs.select_frame.ondragenter = (e) => {
		e.preventDefault();  //阻止拖入時的瀏覽器預設行為
		console.log('拉進來了')
		VueSetting.EmptyDAGSettingWindowClass = 'AliceblueWindow'
		};
			
		this.$refs.select_frame.ondragover = (e) => {
		e.preventDefault();    //阻止拖來拖去的瀏覽器預設行為
		};
		
		this.$refs.select_uploadFileArea.ondragleave = (e) => {
		  e.preventDefault();  //阻止離開時的瀏覽器預設行為
		  VueSetting.EmptyDAGSettingWindowClass = ''
		  console.log('拉離開了')
		},
		
		this.$refs.select_uploadFileArea.ondrop = (e) => {
			VueSetting.EmptyDAGSettingWindowClass = ''
			e.preventDefault();    //阻止拖放後的瀏覽器預設行為
			const data = e.dataTransfer.files;  // 獲取檔案物件
			if (data.length < 1) {
				return;  // 檢測是否有檔案拖拽到頁面     
			}
			VueSetting.inputTest(data)
		};
			
		this.$refs.select_uploadFileArea.ondragenter = (e) => {
		e.preventDefault();  //阻止拖入時的瀏覽器預設行為
		console.log('拉進來了')
		VueSetting.EmptyDAGSettingWindowClass = 'AliceblueWindow'
		};
		
		this.$refs.select_uploadFileArea.ondragover = (e) => {
		e.preventDefault();    //阻止拖來拖去的瀏覽器預設行為
		};
	},
	
	uploadAllDAGRunsInfo(){
		for (S_dagID of Object.keys(this.DAGList)){
			this.uploadDAGRunsInfoByDagId(S_dagID)
		}
	},
})

// ############################################################
// ################ JS output出檔案相關function ###############
// ############################################################

function clickDownload(aLink){
	// 輸出 DAG.py 檔案(已停用)
	str =  encodeURIComponent(VueSetting.DAGFileString.replace(/(^\s*)|(\s*$)/g, ""));
	aLink.download = VueSetting.DAGpyFileName
	aLink.href = "data:text/csv;charset=utf-8,"+str;
}

function OutputDAGStagesSettingCSV(aLink){
	// 輸出 DAGStagesSetting.cav 檔案
	if (VueSetting.dag_item_build_index.length == 0){
		return null
	}
	var outputDAGStagesSettingCSVString = "Task ID,Bash Command\n"
	for (dagItemKey of VueSetting.dag_item_build_index){
		outputDAGStagesSettingCSVString += VueSetting.dag_item_build_list[dagItemKey]['tesk_id']
		outputDAGStagesSettingCSVString += ','
		outputDAGStagesSettingCSVString += VueSetting.dag_item_build_list[dagItemKey]['bash_command']+'\n'
	}
	console.log(outputDAGStagesSettingCSVString)
	var data = outputDAGStagesSettingCSVString;
	var blob = new Blob([data], {
		type : "application/octet-stream"
	});
	aLink.href = URL.createObjectURL(blob);
}

var test