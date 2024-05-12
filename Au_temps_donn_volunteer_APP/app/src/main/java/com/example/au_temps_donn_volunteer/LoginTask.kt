package com.example.au_temps_donn_volunteer

import android.content.Context
import android.os.AsyncTask
import android.util.Log
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.io.OutputStream
import java.net.HttpURLConnection
import java.net.URL

class LoginTask(private val context: Context, private val listener: OnLoginListener) :
    AsyncTask<String, Void, String?>() {

    interface OnLoginListener {
        fun onLoginSuccess(token: String)
        fun onLoginFailed(errorMessage: String)
    }

    override fun doInBackground(vararg params: String): String? {
        val email = params[0]
        val password = params[1]

        try {
            val url = URL("https://au-temps-donne-api.onrender.com/volunteer/app/login")
            val connection = url.openConnection() as HttpURLConnection
            connection.requestMethod = "POST"
            connection.setRequestProperty("Content-Type", "application/json")
            connection.doOutput = true

            val jsonInputString = JSONObject().apply {
                put("email", email)
                put("password", password)
            }.toString()

            val os: OutputStream = connection.outputStream
            os.write(jsonInputString.toByteArray())
            os.flush()

            val responseCode = connection.responseCode
            if (responseCode == HttpURLConnection.HTTP_OK) {
                val reader = BufferedReader(InputStreamReader(connection.inputStream))
                val response = StringBuilder()
                var line: String?
                while (reader.readLine().also { line = it } != null) {
                    response.append(line)
                }
                reader.close()

                val jsonResponse = JSONObject(response.toString())
                val token = jsonResponse.getString("token")
                saveToken(token) // Save token in SharedPreferences
                return token
            } else {
                return null
            }
        } catch (e: Exception) {
            Log.e("LoginTask", "Error during login", e)
            return null
        }
    }

    override fun onPostExecute(result: String?) {
        if (result != null) {
            listener.onLoginSuccess(result)
        } else {
            listener.onLoginFailed("Login failed")
        }
    }

    private fun saveToken(token: String) {
        val sharedPreferences = context.getSharedPreferences("MySharedPreferences", Context.MODE_PRIVATE)
        val editor = sharedPreferences.edit()
        editor.putString("BearerToken", token)
        editor.apply()
    }
}
