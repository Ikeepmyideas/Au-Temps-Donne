package com.example.au_temps_donn_volunteer

import java.text.SimpleDateFormat
import java.util.*

class PlanningManager {

    companion object {
        private const val HOURS_PER_DAY = 12
        private const val DAYS_PER_WEEK = 7

        fun generateCalendarData(startDate: Calendar): List<List<String>> {
            val calendarData = mutableListOf<List<String>>()

            val timeFormat = SimpleDateFormat("h a", Locale.getDefault())

            val currentDate = startDate.clone() as Calendar

            repeat(HOURS_PER_DAY) { hourIndex ->
                val hourData = mutableListOf<String>()

                val hourCalendar = currentDate.clone() as Calendar
                hourCalendar.set(Calendar.HOUR_OF_DAY, hourIndex + 8)

                repeat(DAYS_PER_WEEK) { dayIndex ->
                    hourData.add(timeFormat.format(hourCalendar.time))

                    hourCalendar.add(Calendar.DAY_OF_YEAR, 1)
                }

                calendarData.add(hourData)
            }

            return calendarData
        }
    }
}
