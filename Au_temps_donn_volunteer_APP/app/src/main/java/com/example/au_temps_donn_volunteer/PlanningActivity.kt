package com.example.au_temps_donn_volunteer

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL
import java.text.SimpleDateFormat
import java.util.*

class PlanningActivity : AppCompatActivity() {

    private lateinit var dateTextView: TextView
    private lateinit var hoursLayout: LinearLayout
    private var currentDate: Calendar = Calendar.getInstance()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_planning)

        val buttonBackToMenu: Button = findViewById(R.id.button_back_to_menu)
        buttonBackToMenu.setOnClickListener {
            startActivity(Intent(this, MenuActivity::class.java))
            finish()
        }

        dateTextView = findViewById(R.id.dateTextView)
        hoursLayout = findViewById(R.id.hoursLayout)
        val prevDayButton: Button = findViewById(R.id.prevDayButton)
        val nextDayButton: Button = findViewById(R.id.nextDayButton)

        prevDayButton.setOnClickListener {
            currentDate.add(Calendar.DATE, -1)
            fetchAndDisplayEvents()
        }

        nextDayButton.setOnClickListener {
            currentDate.add(Calendar.DATE, 1)
            fetchAndDisplayEvents()
        }

        fetchAndDisplayEvents()
    }

    private fun fetchAndDisplayEvents() {
        fetchEvents { events ->
            runOnUiThread {
                displayDateAndHours(events)
            }
        }
    }

    private fun fetchEvents(callback: (List<Event>) -> Unit) {
        val jwtToken = getStoredToken() ?: return

        Thread {
            try {
                val connection = URL("https://au-temps-donne-api.onrender.com/api/volunteer/app/activites_prives").openConnection() as HttpURLConnection
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

                    val events = parseEvents(response.toString())
                    callback(events)

                    Log.d("PlanningActivity", "Fetched events successfully")
                } else {
                    Log.e("PlanningActivity", "Failed to fetch events: $responseCode")
                }
            } catch (e: Exception) {
                Log.e("PlanningActivity", "Error fetching events", e)
            }
        }.start()
    }

    private fun parseEvents(jsonString: String): List<Event> {
        val events = mutableListOf<Event>()

        try {
            val jsonObject = JSONObject(jsonString)
            val activitiesArray = jsonObject.getJSONArray("activites")

            for (i in 0 until activitiesArray.length()) {
                val activityObject = activitiesArray.getJSONObject(i)
                val title = activityObject.getString("titre")
                val startDate = activityObject.getString("date_activite")
                val startTime = activityObject.getString("heure_debut")
                val endTime = activityObject.getString("heure_fin")

                val event = Event(title, startDate, startTime, endTime)
                events.add(event)
            }
        } catch (e: Exception) {
            Log.e("PlanningActivity", "Error parsing events", e)
        }

        return events
    }

    private fun displayDateAndHours(events: List<Event>) {
        val formatter = SimpleDateFormat("EEE, MMM d, yyyy", Locale.FRENCH) // Use French locale
        dateTextView.text = formatter.format(currentDate.time)

        hoursLayout.removeAllViews()
        val currentDayEvents = getEventsForCurrentDay(events)

        currentDayEvents.forEach { event ->
            val eventTextView = TextView(this)
            eventTextView.text = "${event.title}: ${event.startTime} - ${event.endTime}"
            eventTextView.textSize = 16f
            hoursLayout.addView(eventTextView)
        }

        Log.d("PlanningActivity", "Displayed events for ${formatter.format(currentDate.time)}")
    }

    private fun getEventsForCurrentDay(events: List<Event>): List<Event> {
        val formattedDate = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(currentDate.time)
        return events.filter { it.startDate == formattedDate }
    }

    data class Event(val title: String, val startDate: String, val startTime: String, val endTime: String)

    private fun getStoredToken(): String? {
        val sharedPreferences = getSharedPreferences("MySharedPreferences", MODE_PRIVATE)
        return sharedPreferences.getString("BearerToken", null)
    }
}
