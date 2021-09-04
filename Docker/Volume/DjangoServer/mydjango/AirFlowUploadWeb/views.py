from django.shortcuts import render
from django.http import JsonResponse
from django.utils.decorators import method_decorator 
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponseRedirect
import time
import sys
import os
sys.path.append(os.path.split(os.path.realpath(__file__))[0])
import connectAirflow

airflowConnecter = connectAirflow.airflowConnecter(
    'man4781747@gmail.com',
    'Qoo_83367632',
    'http://airflow:8080'
)

# Create your views here.
def test(request):
    return JsonResponse({'AllPicDate':[1,2,3]})
    
def MainWeb(request):
    return render(request, 'MainHTML.html', {})

@method_decorator(csrf_exempt)
def GetUploadedFile(request):
    # time.sleep(5)
    if request.method == 'POST':
        try:
            with open(request.POST['fileName'], 'wb') as f:
                for chunk in request.FILES['fileUploaded'].chunks():
                    f.write(chunk)
            return JsonResponse({'Result':'success', 'fileKey':request.POST['fileKey']})        
        except Exception as e:
            return JsonResponse({'Result': str(e), 'fileKey':request.POST['fileKey']})        

    return JsonResponse({'AllPicDate':[1,2,3]})
    
@method_decorator(csrf_exempt)
def UploadDAGPythonFile(request):

		# DAGpyFileform.append("DAGpyFileName", this.DAGpyFileName)
		# DAGpyFileform.append("DAGpyFileContent", this.DAGFileString)

    # time.sleep(5)
    if request.method == 'POST':
        try:
            with open(request.POST['DAGpyFileName'], 'w', encoding='UTF-8') as f:
                f.write(request.POST['DAGpyFileContent'])
            return JsonResponse({'Result':'success'})        
        except Exception as e:
            return JsonResponse({'Result': str(e)})        

    return JsonResponse({'AllPicDate':[1,2,3]})

# @method_decorator(csrf_exempt)
def GetDAGs_buildByDAGBuilder(request):
    L_allDAGsList = airflowConnecter.getDAGs()
    D_return = {'DAG_List': {}}
    
    for DAGChose in L_allDAGsList:
        tagsList = DAGChose.get('tags', [])
        for tagChose in tagsList:
            if tagChose.get('name', '') == 'buildByDAGBuilder':
                D_return['DAG_List'][DAGChose.get('dag_id')] = DAGChose
                break
              
    # get run list
    # for DAGChose in D_return['DAG_List']:
        # S_dagID = DAGChose.get('dag_id')
        # L_dagRunsList = airflowConnecter.getDAGRunsList(
            # S_dagID,
            # limit=1000,
            # order_by=['-start_date']
        # )
        # DAGChose['dagRunsList'] = L_dagRunsList
    
    return JsonResponse(D_return)

@method_decorator(csrf_exempt)
def GetDAGRunsList(request):
    if request.method == 'POST':
        L_dagRunsList = airflowConnecter.getDAGRunsList(
            request.POST['DAG_ID'],
            limit=1000,
            order_by=['-start_date']
        )
        
        return JsonResponse({
            'DAG_ID':request.POST['DAG_ID'],
            'DAG_Runs': L_dagRunsList
        })
    else:
        return JsonResponse({'AllPicDate':[1,2,3]})