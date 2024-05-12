package com.example.au_temps_donn_volunteer

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import org.json.JSONArray
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL

class EventActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_event)

        val buttonBackToMenu: Button = findViewById(R.id.button_back_to_menu)
        buttonBackToMenu.setOnClickListener {
            startActivity(Intent(this, MenuActivity::class.java))
            finish()
        }

        GlobalScope.launch(Dispatchers.IO) {
            fetchEvents()
        }
    }

    private fun fetchEvents() {
        try {
            val url = URL("https://au-temps-donne-api.onrender.com/api/event/activites")
            val connection = url.openConnection() as HttpURLConnection
            connection.requestMethod = "GET"

            val responseCode = connection.responseCode
            if (responseCode == HttpURLConnection.HTTP_OK) {
                val reader = BufferedReader(InputStreamReader(connection.inputStream))
                val response = StringBuilder()
                var line: String?
                while (reader.readLine().also { line = it } != null) {
                    response.append(line)
                }
                reader.close()
                val eventsArray = JSONArray(response.toString())
                if (eventsArray.length() > 0) {
                    runOnUiThread {
                        val eventsLinearLayout = findViewById<LinearLayout>(R.id.eventsLinearLayout)
                        for (i in 0 until eventsArray.length()) {
                            val eventObject = eventsArray.getJSONObject(i)
                            val eventId = eventObject.getInt("ID_Activite")
                            val eventName = eventObject.getString("titre")
                            val eventDate = eventObject.getString("date_activite")
                            val eventService = eventObject.getString("nom_service")
                            val eventNbenevoles = eventObject.getInt("nb_benevoles")
                            val eventLocation = eventObject.getJSONObject("lieu").getString("adresse")
                            val eventVille = eventObject.getJSONObject("lieu").getString("ville")

                            val eventView = layoutInflater.inflate(R.layout.item_event, null)
                            val eventNameTextView: TextView = eventView.findViewById(R.id.textViewEventName)
                            val eventDateTextView: TextView = eventView.findViewById(R.id.textViewEventDate)
                            val eventLocationTextView: TextView = eventView.findViewById(R.id.textViewEventLocation)
                            val eventServiceTextView: TextView = eventView.findViewById(R.id.textViewEventService)
                            val eventNbenevolesTextView: TextView = eventView.findViewById(R.id.textViewEventNbenevoles)
                            val eventVilleTextView: TextView = eventView.findViewById(R.id.textViewEventVille)

                            eventNameTextView.text = "Titre: $eventName"
                            eventDateTextView.text = "Date: $eventDate"
                            eventLocationTextView.text = "Adresse: $eventLocation"
                            eventVilleTextView.text = "Ville: $eventVille"
                            eventServiceTextView.text = "Service: $eventService"
                            eventNbenevolesTextView.text = "Nombre de benevoles: $eventNbenevoles"

                            eventsLinearLayout.addView(eventView)
                        }
                    }
                }
            } else {
                Log.e("EventActivity", "Failed to fetch events: $responseCode")
            }
        } catch (e: Exception) {
            Log.e("EventActivity", "Error fetching events", e)
        }
    }
}
