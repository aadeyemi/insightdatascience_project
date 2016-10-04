package com.a54metrics.litali;

import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;

/**
 * Created by yemi on 9/20/16.
 * For Insight Project.
 */

public class ServerResponseToHashMap {

    public HashMap<String,String> getHashMap (String dataString, String[] inKeys, String[] outKeys) {

        String TAG = "ServerResponseToHashMap";

        HashMap<String,String> hmap = new HashMap<>();

        if (dataString.trim().equals("") || dataString.isEmpty()) {
            hmap.put("status", "-999");
            hmap.put("title", "Error Connecting");
            hmap.put("message", "Unable to make connection at this time");

            return hmap;
        }

        for (int j=0; j<inKeys.length; j++) {
            hmap.put(outKeys[j], "");
        }

        try {
            if (!dataString.trim().equals("") && !dataString.isEmpty()) {
                JSONObject object = new JSONObject(dataString);
                for (int j = 0; j < inKeys.length; j++) {
                    hmap.put(outKeys[j], object.getString(inKeys[j]));
                }

                Log.i(TAG, hmap.toString());
            }

        } catch (JSONException e) {
            Log.e(TAG, e.getMessage());
        }

        return hmap;

    }
}