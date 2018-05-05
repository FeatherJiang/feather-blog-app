package com.featherblogapp;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.view.Window;

/**
 * Created by feather on 2018/5/5.
 */

public class Start_Interface extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.start_interface);
        new Handler().postDelayed(new Runnable(){
            @Override
            public void run() {
                Intent mainIntent = new Intent(Start_Interface.this,MainActivity.class);
                Start_Interface.this.startActivity(mainIntent);
                Start_Interface.this.finish();
            }
        },2000);

    }
}
