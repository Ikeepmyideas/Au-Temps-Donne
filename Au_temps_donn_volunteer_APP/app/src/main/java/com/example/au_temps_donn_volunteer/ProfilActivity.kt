package com.example.au_temps_donn_volunteer

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import android.util.Log
import android.widget.Button
import android.widget.TextView
import kotlinx.coroutines.*
import org.json.JSONException
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL

class ProfilActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_profile)

        val buttonBackToMenu: Button = findViewById(R.id.button_back_to_menu)
        buttonBackToMenu.setOnClickListener {
            startActivity(Intent(this, MenuActivity::class.java))
            finish()
        }

        val logoutButton = findViewById<Button>(R.id.button_logout)
        logoutButton.setOnClickListener {
            logout()
        }

        val jwtToken = getStoredToken()

        if (jwtToken == null) {
            Log.e("ProfilActivity", "JWT Token is null")
            return
        }

        CoroutineScope(Dispatchers.IO).launch {
            val userInfo = fetchUserInfo(jwtToken)
            withContext(Dispatchers.Main) {
                updateUI(userInfo)
            }
        }
    }

    private fun logout() {
        val sharedPreferences = getSharedPreferences("MySharedPreferences", MODE_PRIVATE)
        sharedPreferences.edit().remove("BearerToken").apply()

        val intent = Intent(this, MainActivity::class.java)
        startActivity(intent)
        finish()
    }

    private fun getStoredToken(): String? {
        val sharedPreferences = getSharedPreferences("MySharedPreferences", MODE_PRIVATE)
        return sharedPreferences.getString("BearerToken", null)
    }

    private fun fetchUserInfo(jwtToken: String): String? {
        return try {
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

                val userInfo = response.toString()
                Log.d("ProfilActivity", "User Info: $userInfo")

                userInfo
            } else {
                Log.e("ProfilActivity", "Failed to fetch user info: $responseCode")
                null
            }
        } catch (e: Exception) {
            Log.e("ProfilActivity", "Error fetching user info: ${e.message}", e)
            null
        }
    }

    private fun updateUI(userInfo: String?) {
        if (userInfo != null) {
            try {
                val jsonObject = JSONObject(userInfo)
                val volunteerObject = jsonObject.getJSONObject("volunteer")

                findViewById<TextView>(R.id.NomProfile).text = volunteerObject.getString("nom")
                findViewById<TextView>(R.id.NomPrenomProfile).text = volunteerObject.getString("nom") + " " + volunteerObject.getString("prenom")
                findViewById<TextView>(R.id.GenreProfile).text = volunteerObject.getString("genre")
                findViewById<TextView>(R.id.BirthProfile).text = volunteerObject.getString("date_de_naissance")
                findViewById<TextView>(R.id.AdressProfile).text = volunteerObject.getString("adresse")
                findViewById<TextView>(R.id.CodePostalVilleProfile).text = volunteerObject.getString("ville") + ", " + volunteerObject.getString("code_postal")
                findViewById<TextView>(R.id.TelephoneProfile).text = volunteerObject.getString("telephone")
                findViewById<TextView>(R.id.EmailProfile).text = volunteerObject.getString("email")
            } catch (e: JSONException) {
                Log.e("ProfilActivity", "Error parsing user info JSON", e)
            }
        } else {
            Log.e("ProfilActivity", "User info is null")
        }
    }
}
