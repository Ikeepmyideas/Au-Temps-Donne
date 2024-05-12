package com.example.au_temps_donn_volunteer

import android.app.PendingIntent
import android.content.Intent
import android.nfc.NfcAdapter
import android.nfc.Tag
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class NFCScannerActivity : AppCompatActivity() {

    private var nfcAdapter: NfcAdapter? = null
    private var pendingIntent: PendingIntent? = null
    private var textView: TextView? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_nfc_scanner)

        val buttonBackToMenu: Button = findViewById(R.id.button_back_to_menu)
        buttonBackToMenu.setOnClickListener {
            startActivity(Intent(this, MenuActivity::class.java))
            finish()
        }

        nfcAdapter = NfcAdapter.getDefaultAdapter(this)

        val intent = Intent(this, javaClass).apply {
            addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)
        }
        pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_IMMUTABLE)

        textView = findViewById(R.id.textViewMessage)
    }

    override fun onResume() {
        super.onResume()
        nfcAdapter?.enableForegroundDispatch(this, pendingIntent, null, null)
    }

    override fun onPause() {
        super.onPause()
        nfcAdapter?.disableForegroundDispatch(this)
    }

    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        if (NfcAdapter.ACTION_TAG_DISCOVERED == intent?.action) {
            val tag = intent.getParcelableExtra<Tag>(NfcAdapter.EXTRA_TAG)
            processTagData(tag)
        }
    }

    private fun processTagData(tag: Tag?) {
        if (tag != null) {
            val tagId = bytesToHexString(tag.id)
            Log.d("NFCScannerActivity", "Tag ID: $tagId")
            textView?.text = "NFC identified successfully"
        } else {
            Log.e("NFCScannerActivity", "Tag is null")
        }
    }


    private fun bytesToHexString(bytes: ByteArray?): String {
        if (bytes == null) {
            return ""
        }
        val stringBuilder = StringBuilder(bytes.size * 2)
        for (byte in bytes) {
            val hex = Integer.toHexString(0xFF and byte.toInt())
            if (hex.length == 1) {
                stringBuilder.append('0')
            }
            stringBuilder.append(hex)
        }
        return stringBuilder.toString()
    }
}
