package com.example.au_temps_donn_volunteer

import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.os.Bundle
import android.os.Handler
import android.util.Log
import android.widget.Button
import android.widget.EditText
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity(), LoginTask.OnLoginListener {

    companion object {
        private const val SPLASH_DURATION: Long = 3000
        private const val PREF_NAME = "MyPrefs"
        private const val TOKEN_KEY = "token"
    }

    private lateinit var sharedPreferences: SharedPreferences

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)

        sharedPreferences = getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)

        Handler().postDelayed({
            setContentView(R.layout.activity_login)
            setupLogin()
        }, SPLASH_DURATION)

    }

    private fun setupLogin() {
        val emailEditText: EditText = findViewById(R.id.editTextEmail)
        val passwordEditText: EditText = findViewById(R.id.editTextPassword)
        val loginButton: Button = findViewById(R.id.buttonLogin)

        loginButton.setOnClickListener {
            val email = emailEditText.text.toString()
            val password = passwordEditText.text.toString()

            Log.d("MainActivity", "Login button clicked")

            val loginTask = LoginTask(this, this)
            loginTask.execute(email, password)
        }
    }

    override fun onLoginSuccess(token: String) {
        Log.d("MainActivity", "Login successful!")

        saveToken(token)

        navigateToMenu()
    }

    override fun onLoginFailed(errorMessage: String) {
        Log.e("MainActivity", "Login failed: $errorMessage")
    }

    private fun saveToken(token: String) {
        sharedPreferences.edit().putString(TOKEN_KEY, token).apply()
    }

    private fun navigateToMenu() {
        val intent = Intent(this, MenuActivity::class.java)
        startActivity(intent)
        finish()
    }
}
