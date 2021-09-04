import requests
import csv
import json
import datetime
import time
import os
from bs4 import BeautifulSoup

class NewsSearcher:
    def __init__(self):
        self.S_baseUrl = r"https://news.ltn.com.tw/ajax/breakingnews/all/{}"
        self.L_csvHeader = ["title", "date", "time", "url"]
        self.S_csvFileName = "{}.csv".format(datetime.datetime.now().strftime("%Y%m%d%H%M%S"))
        self.S_csvFolferPath = os.path.join(
            os.path.split(os.path.realpath(__file__))[0],
            "HistoryCSVFile"
        )
        if not os.path.exists(self.S_csvFolferPath):
            os.makedirs(self.S_csvFolferPath)
        self.S_csvFullPath = os.path.join(self.S_csvFolferPath, self.S_csvFileName)
        
        self.S_date = datetime.datetime.now().strftime("%Y/%m/%d")
        
        self.RunFlow()
        
    def RunFlow(self):
        self.BuildNewCsvFile()
    
        I_page = 1
        while True:
            print(I_page)
            D_newsData = self.GatAllList(self.S_baseUrl.format(I_page))
            
            if type(D_newsData['data']) == list:
                for D_NewsInfo in D_newsData['data']:
                    if len(D_NewsInfo['time']) == 5:
                        D_NewsInfo['date'] = self.S_date
                    else:
                        L_date_time = D_NewsInfo['time'].split(' ')
                        D_NewsInfo['time'] = L_date_time[1]
                        D_NewsInfo['date'] = L_date_time[0]
                    self.WriteDataInCsv(D_NewsInfo)
                    
            elif type(D_newsData['data']) == dict:
                for S_NewsInfoKey in D_newsData['data'].keys():
                    D_NewsInfo = D_newsData['data'][S_NewsInfoKey]
                    if len(D_NewsInfo['time']) == 5:
                        D_NewsInfo['date'] = self.S_date
                    else:
                        L_date_time = D_NewsInfo['time'].split(' ')
                        D_NewsInfo['time'] = L_date_time[1]
                        D_NewsInfo['date'] = L_date_time[0]
                    self.WriteDataInCsv(D_NewsInfo)
            
            if D_newsData['data'] == {} or D_newsData['data'] == []:
                break
            I_page += 1
            time.sleep(0.1)

    # HTTP requests
    def GatAllList(self, S_fullUrl):
        resp = requests.get(S_fullUrl)
        D_jsonData = resp.json()
        return D_jsonData
        
    def GetNewsPageData(self, S_newsUrl):
        D_detailDict = {}
        resp = requests.get(S_newsUrl)
        soup = BeautifulSoup(resp.text, 'html.parser')
        D_detailDict['title'] = soup.find_all('h1')[0].text
        L_date_time = soup.select('span.time')[0].text.strip().split(' ')
        D_detailDict['date'] = L_date_time[0]
        D_detailDict['time'] = L_date_time[1]
        D_detailDict['url'] = S_newsUrl
        return D_detailDict
        
    def GetNewsPageDatetime(self, S_newsUrl):
        D_newsPageDatetime = {}
        resp = requests.get(S_newsUrl)
        soup = BeautifulSoup(resp.text, 'html.parser')
        L_date_time = soup.select('span.time')[0].text.strip().split(' ')
        print(L_date_time)
        D_newsPageDatetime['date'] = L_date_time[0]
        D_newsPageDatetime['time'] = L_date_time[1]
        return D_newsPageDatetime
    
    # CSV 
    def BuildNewCsvFile(self):
        with open(self.S_csvFullPath, 'w', newline='', encoding="UTF-8") as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=self.L_csvHeader)
            writer.writeheader()
    
    def WriteDataInCsv(self, D_data):
        with open(self.S_csvFullPath, 'a', newline='', encoding="UTF-8") as csvfile:
            writer = csv.writer(csvfile, delimiter=',')
            writer.writerow([D_data[key] for key in self.L_csvHeader])

NewsSearcher()