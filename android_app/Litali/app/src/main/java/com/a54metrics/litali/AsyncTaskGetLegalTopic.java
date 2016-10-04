package com.a54metrics.litali;

import android.os.AsyncTask;
import android.util.Log;

import java.net.URLEncoder;
import java.util.HashMap;

/**
 * Created by yemi on 9/20/16.
 * For Insight Project.
 */

public class AsyncTaskGetLegalTopic extends AsyncTask<String,Void,String> {

    private MainActivity.OnGetLegalTopicTaskCompleted mListener;

    private ServerRequestHelper mServerRequestHelper;
    private ServerResponseToHashMap mServerResponseToHashMap;
    private int receiverId = -9;

    private static final String TAG = "AsyncGetUserDetails";


    public AsyncTaskGetLegalTopic (MainActivity.OnGetLegalTopicTaskCompleted listener) {
        mListener = listener;
        mServerRequestHelper =  new ServerRequestHelper();
        mServerResponseToHashMap = new ServerResponseToHashMap();
        receiverId = 0;
    }

    protected void onPreExecute(){}

    @Override
    protected String doInBackground(String... arg0) {
        String text = arg0[0];
        return makeGetLegalTopicRequest(text);
    }
    protected void onPostExecute(String result){

        if (result.trim().equals("")) { return; }

        HashMap<String,String> hmap = serverResponsetoHashmap (result);

        if (receiverId == 0) mListener.onGetLegalTopicTaskCompleted(hmap);
    }

    public HashMap<String,String> serverResponsetoHashmap (String dataString) {

        String[] inKeys = {"status","message"};
        String[] outKeys = {"status","message"};

        return mServerResponseToHashMap.getHashMap(dataString,inKeys,outKeys);
    }

    private String makeGetLegalTopicRequest(String text) {
        try{
            String address = "http://54metrics.com/insightdatascience/predictor/call_predictor.php";
            String data  =  URLEncoder.encode("text", "UTF-8") + "=" + URLEncoder.encode(text, "UTF-8");

            return mServerRequestHelper.makeRequest(address,data);
        } catch(Exception e){
            Log.e(TAG, e.getMessage());
            return "";
        }

    }

}
