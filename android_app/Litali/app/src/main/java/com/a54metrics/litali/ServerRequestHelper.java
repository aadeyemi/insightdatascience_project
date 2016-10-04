package com.a54metrics.litali;

import android.util.Log;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.URL;
import java.net.URLConnection;

/**
 * Created by yemi on 9/20/16.
 * For Insight Project.
 */

public class ServerRequestHelper {
    private String TAG = "ServerRequestHelper";

    public String makeRequest(String urlAddress, String data) {

        String output;

        try{

            URL url = new URL(urlAddress);
            URLConnection conn = url.openConnection();

            conn.setDoOutput(true);
            OutputStreamWriter wr = new OutputStreamWriter(conn.getOutputStream());

            wr.write(data);
            wr.flush();
            BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            output = ReadBigStringIn(reader);
            wr.close();
            reader.close();

        } catch(Exception e){
            Log.e(TAG, e.getMessage());

            output = "";
        }

        return output;

    }

    public String ReadBigStringIn(BufferedReader buffIn) throws IOException {
        StringBuilder everything = new StringBuilder();
        String line;
        while( (line = buffIn.readLine()) != null) {
            everything.append(line);
        }
        Log.i(TAG, everything.toString());
        return everything.toString();
    }
}