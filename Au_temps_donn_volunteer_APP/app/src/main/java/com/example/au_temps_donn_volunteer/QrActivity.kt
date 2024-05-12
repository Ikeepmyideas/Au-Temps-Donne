package com.example.au_temps_donn_volunteer

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.google.android.material.floatingactionbutton.FloatingActionButton
import com.google.zxing.integration.android.IntentIntegrator
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import kotlin.concurrent.thread

class QrActivity : AppCompatActivity() {

    private val CAMERA_PERMISSION_CODE = 100
    private val TAG = "QrActivity"
    private val SERVER_URL = "https://au-temps-donne-api.onrender.com/api/volunteer/processQrCode"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_scanner)

        val buttonBackToMenu: Button = findViewById(R.id.button_back_to_menu)
        buttonBackToMenu.setOnClickListener {
            startActivity(Intent(this, MenuActivity::class.java))
            finish()
        }

        val floatingActionButton: FloatingActionButton = findViewById(R.id.floatingActionButton)

        floatingActionButton.setOnClickListener {
            if (ContextCompat.checkSelfPermission(
                    this,
                    Manifest.permission.CAMERA
                ) == PackageManager.PERMISSION_GRANTED
            ) {
                startQRScanning()
            } else {
                ActivityCompat.requestPermissions(
                    this,
                    arrayOf(Manifest.permission.CAMERA),
                    CAMERA_PERMISSION_CODE
                )
            }
        }
    }

    private fun startQRScanning() {
        Log.d(TAG, "QR scanning started")

        val integrator = IntentIntegrator(this)
        integrator.setPrompt("Scan a QR Code")
        integrator.setBeepEnabled(true)
        integrator.setOrientationLocked(false)
        integrator.setCameraId(0)
        integrator.setDesiredBarcodeFormats(IntentIntegrator.QR_CODE)
        integrator.initiateScan()
    }


    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == CAMERA_PERMISSION_CODE) {
            if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                startQRScanning()
            } else {
                Log.d(TAG, "Camera permission denied")
                finish()
            }
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        val result = IntentIntegrator.parseActivityResult(requestCode, resultCode, data)
        if (result != null) {
            if (result.contents == null) {
                Log.d(TAG, "Cancelled")
            } else {
                Log.d(TAG, "Scanned: " + result.contents)
                sendQRCodeDataToServer(result.contents)
            }
        } else {
            super.onActivityResult(requestCode, resultCode, data)
        }
    }

    private fun sendQRCodeDataToServer(qrCodeData: String) {
        thread {
            try {
                val url = URL(SERVER_URL)
                val connection = url.openConnection() as HttpURLConnection
                connection.requestMethod = "PUT"
                connection.setRequestProperty("Content-Type", "application/json")
                connection.doOutput = true

                val jsonObject = JSONObject().apply {
                    put("qrCodeData", qrCodeData)
                }
                val outputStream = connection.outputStream
                outputStream.write(jsonObject.toString().toByteArray())
                outputStream.flush()

                val responseCode = connection.responseCode
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    val inputStream = connection.inputStream
                    val response = inputStream.bufferedReader().use { it.readText() }

                    Log.d(TAG, "Response from server: $response")

                    runOnUiThread {
                        findViewById<TextView>(R.id.text_result).text = "Scan Successful"
                    }
                } else {
                    Log.e(TAG, "Failed to send QR code data. Response code: $responseCode")
                }

                connection.disconnect()
            } catch (e: Exception) {
                Log.e(TAG, "Failed to send QR code data: ${e.message}")
            }
        }
    }
}
