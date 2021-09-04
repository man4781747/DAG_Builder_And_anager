

var app = new Vue({
	el: '#app',
	data: {
		message: 'Hello Vue!',
		
		D_cronDataSetting: {
			'Month': {
				cronType: '1',
				cronCollect: [],
				cron_Value: 1,
				maxValue: 12,
				windowShow: true,
			},
			'Day': {
				cronType: '1',
				cronCollect: [],
				cron_Value: 1,
				maxValue: 31,
				windowShow: true,
			},
			'Hour': {
				cronType: '1',
				cronCollect: [],
				cron_Value: 1,
				maxValue: 23,
				windowShow: true,
			},
			'Minute' : {
				cronType: '1',
				cronCollect: [],
				cron_Value: 1,
				maxValue: 59,
				windowShow: true,
			},
		},
		
		cronWeekDayCollect: [0,1,2,3,4,5,6],
		
		weekdayChinese: weekDayToChiness = {
			'0' : '日',
			'1' : '一',
			'2' : '二',
			'3' : '三',
			'4' : '四',
			'5' : '五',
			'6' : '六',
			'7' : '日',
		},

	},
	
	computed: {
		// cronMonthCollect_Sorted(){
			// return this.cronMonthCollect.sort()
		// },
		
		cornMonth (){
			if (this.D_cronDataSetting['Month'].cronType=='1'){
				if (this.D_cronDataSetting['Month'].cronCollect.length == 0){
					return '*'
				}
				return this.D_cronDataSetting['Month'].cronCollect.join(',')
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
				}
				return this.D_cronDataSetting['Day'].cronCollect.join(',')
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
				}
				return this.D_cronDataSetting['Hour'].cronCollect.join(',')
			} else {
				if (this.D_cronDataSetting['Hour'].cron_Value==1){
					return "*"
				}
				return "*/"+this.D_cronDataSetting['Hour'].cron_Value
			}
		},
		
		cornMinute (){
			if (this.D_cronDataSetting['Minute'].cronType=='1'){
				if (this.D_cronDataSetting['Minute'].cronCollect.length == 0){
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
			return this.cronWeekDayCollect.join(',')
		},
		
		cronWeekDayCollectSet() {
			if (this.cronWeekDayCollect.length==0){
				return new Set([1,2,3,4,5,6,7])
			}
			return new Set(this.cronWeekDayCollect)
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
	},
	
	methods: {
		switchCronType(S_witchCron){
			if (this.D_cronDataSetting[S_witchCron].cronType == '1'){
				this.D_cronDataSetting[S_witchCron].cronType = '2'
			} else {
				this.D_cronDataSetting[S_witchCron].cronType = '1'
			}
		},
		switchCronChangeWindow(S_cronType){
			this.D_cronDataSetting[S_cronType].windowShow = !this.D_cronDataSetting[S_cronType].windowShow
		},
	},
	
})
