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


// ############################################################
// ######################  Vue App 區塊  ######################
// ############################################################

var VueSetting = new Vue({
	el: '#app',
	data: {
		// 基礎資訊
		massage: '030',
		DAGList: {},
		// Misc.
		
	},
  
	computed: {
		
	},
  
	methods: {
		uploadDAGRunsInfoByDagId(S_dagID){
			let params = new FormData();
			params.append("DAG_ID", S_dagID)
			fetch("http://127.0.0.1:8000/AirFlowUploadWeb/GetDAGRunsList/", {
				method: 'POST',
				body: params,
			}).then(function(response) {
				return response.json();
			})
			.then(function(myJson) {
				if (myJson['DAG_Runs'] != undefined){
					let DAG_RunsList = {
						'total' : myJson['DAG_Runs']['dag_runs'],
						'groups' : {}
					}
					for (dagRunChose of myJson['DAG_Runs']['dag_runs']){
						let S_state = dagRunChose['state']
						if (DAG_RunsList['groups'][S_state] == undefined){
							DAG_RunsList['groups'][S_state] = []
						}
						DAG_RunsList['groups'][S_state].push(dagRunChose)
					}
					Vue.set(
						VueSetting.DAGList[S_dagID],
						'dagRuns',
						DAG_RunsList
					)
				} else {
					console.log('Upload Fail')
					console.log(myJson)
				}
			})
		},
	
		
	},
	
	highlighter(code) {
	// js highlight example
		return Prism.highlight(code, Prism.languages.py, "py");
	},
  
})

function getDAGList() {
	// 獲得DAG清單
	fetch("http://127.0.0.1:8000/AirFlowUploadWeb/GetDAGs/")
	.then(function(response) {
		return response.json();
	})
	.then(function(myJson) {
		console.log('獲得DAG清單')
		console.log(myJson['DAG_List']);
		
		// L_dagList = groupDAGrunsByStatus(myJson['DAG_List'])
		
		
		
		VueSetting.DAGList = myJson['DAG_List']
		
		
	});
}

function groupDAGrunsByStatus(L_dagList){
	for (D_dagChose of L_dagList){
		D_dagChose['dagRunsList']['groupBy'] = {}
		var L_dagRunsTotla = D_dagChose['dagRunsList']['dag_runs']
		for (D_dagRunChose of L_dagRunsTotla){
			var S_state = D_dagRunChose['state']
			if (D_dagChose['dagRunsList']['dag_runs'][S_state] == undefined){
				D_dagChose['dagRunsList']['dag_runs'][S_state] = []
			}
			D_dagChose['dagRunsList']['dag_runs'][S_state].push(D_dagRunChose)
			console.log(D_dagRunChose)
		}
	}
	return L_dagList
}

getDAGList()