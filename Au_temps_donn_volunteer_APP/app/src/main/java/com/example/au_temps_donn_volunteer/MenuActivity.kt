package com.example.au_temps_donn_volunteer

import android.content.Context
import android.os.Bundle
import android.util.Log
import android.widget.TextView
import android.widget.ImageView
import androidx.appcompat.app.AppCompatActivity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONException
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale
import java.net.URL
import android.content.Intent;


class MenuActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_menu)

        val textViewUserInfo: TextView = findViewById(R.id.textView3)
        val textViewCurrentDate: TextView = findViewById(R.id.textView4)

        val currentDate = Calendar.getInstance().time

        val frenchDateFormat = SimpleDateFormat("EEEE d MMMM", Locale.FRENCH)
        val formattedDate = frenchDateFormat.format(currentDate)

        textViewCurrentDate.text = formattedDate
        val imageViewMenuPlanning: ImageView = findViewById(R.id.imageViewPlanning)

        imageViewMenuPlanning.setOnClickListener {
            val intent = Intent(this, PlanningActivity::class.java)
            startActivity(intent)
        }

        val imageViewEvents: ImageView = findViewById(R.id.imageView16)

        imageViewEvents.setOnClickListener {
            val intent = Intent(this, EventActivity::class.java)
            startActivity(intent)
        }

        val imageViewNFC: ImageView = findViewById(R.id.imageView7)

        imageViewNFC.setOnClickListener {
            val intent = Intent(this, NFCScannerActivity::class.java)
            startActivity(intent)
        }

        val imageViewProfile: ImageView = findViewById(R.id.imageView13)

        imageViewProfile.setOnClickListener {
            val intent = Intent(this, ProfilActivity::class.java)
            startActivity(intent)
        }

        val imageViewMenu: ImageView = findViewById(R.id.imageViewQRCODE)

        imageViewMenu.setOnClickListener {
            val intent = Intent(this, QrActivity::class.java)
            startActivity(intent)
        }

        GlobalScope.launch(Dispatchers.IO) {
            val jwtToken = getStoredToken()
            if (jwtToken != null) {
                try {
                    val userInfoResponse = fetchUserInfo(jwtToken)
                    if (userInfoResponse != null) {
                        try {
                            val userInfo = JSONObject(userInfoResponse)
                            val volunteerInfo = userInfo.getJSONObject("volunteer")

                            val userId = volunteerInfo.getInt("id")
                            val userEmail = volunteerInfo.getString("email")
                            val userFullName = " ${volunteerInfo.getString("prenom")}"

                            val userInfoString = "Bienvenue $userFullName"

                            withContext(Dispatchers.Main) {
                                textViewUserInfo.text = userInfoString
                            }
                        } catch (e: JSONException) {
                            Log.e("MenuActivity", "Error parsing user info JSON", e)
                        }
                    } else {
                        Log.e("MenuActivity", "Failed to fetch user info")
                    }
                } catch (e: Exception) {
                    Log.e("MenuActivity", "Error fetching user info", e)
                }
            } else {
                Log.e("MenuActivity", "No JWT token found")
            }
        }
    }

    private fun getStoredToken(): String? {
        val sharedPreferences = getSharedPreferences("MySharedPreferences", Context.MODE_PRIVATE)
        return sharedPreferences.getString("BearerToken", null)
    }

    private fun fetchUserInfo(jwtToken: String): String? {
        try {
            val url = URL("https://au-temps-donne-api.onrender.com/api/volunteer/app/userinfo")
            val connection = url.openConnection() as HttpURLConnection
            connection.requestMethod = "GET"
            connection.setRequestProperty("Authorization", "Bearer $jwtToken")

            val responseCode = connection.responseCode
            if (responseCode == HttpURLConnection.HTTP_OK) {
                val reader = BufferedReader(InputStreamReader(connection.inputStream))
                val response = StringBuilder()
                var line: String?
                while (reader.readLine().also { line = it } != null) {
                    response.append(line)
                }
                reader.close()
                return response.toString()
            } else {
                Log.e("MenuActivity", "Failed to fetch user info: $responseCode")
                return null
            }
        } catch (e: Exception) {
            Log.e("MenuActivity", "Error fetching user info", e)
            return null
        }
    }

}
