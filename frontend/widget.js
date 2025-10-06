// frontend/widget.js
const SentimentWidget = (function() {
  function init(config) {
    const container = document.getElementById(config.container);
    if (!container) {
      console.error("SentimentWidget: Container not found");
      return;
    }

    // Widget structure
    container.innerHTML = `
      <div style="
        width: 350px; 
        padding: 20px; 
        background: #fff; 
        border-radius: 15px; 
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        font-family: sans-serif;
      ">
        <h3 style="text-align:center; color:#333;">AI Sentiment Analyzer</h3>
        <textarea id="sw_text" rows="4" 
          style="width:100%; padding:10px; border-radius:10px; border:1px solid #ccc; resize:none;" 
          placeholder="${config.placeholder || 'Type your text here...'}">
        </textarea>
        <button id="sw_btn" style="
          width:100%; 
          padding:10px; 
          margin-top:10px; 
          background:#4CAF50; 
          color:white; 
          border:none; 
          border-radius:10px;
          cursor:pointer;
          font-size:16px;">
          Analyze
        </button>
        <div id="sw_result" style="margin-top:15px; text-align:center;"></div>
      </div>
    `;

    // Handle click
    document.getElementById("sw_btn").onclick = async () => {
      const text = document.getElementById("sw_text").value.trim();
      const resultDiv = document.getElementById("sw_result");
      if (!text) {
        resultDiv.innerHTML = "<p style='color:gray;'>Please enter some text.</p>";
        return;
      }
      resultDiv.innerHTML = "<p style='color:gray;'>Analyzing...</p>";

      try {
        const response = await fetch(config.apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text })
        });
        const data = await response.json();
        if (data.error) {
          resultDiv.innerHTML = `<p style='color:red;'>${data.error}</p>`;
        } else {
          const color = data.polarity > 0 ? "green" : data.polarity < 0 ? "red" : "gray";
          resultDiv.innerHTML = `
            <p style="color:${color}; font-size:18px;">
              ${data.sentiment} <br>
              <small>Polarity: ${data.polarity.toFixed(3)}</small>
            </p>`;
        }
      } catch (err) {
        resultDiv.innerHTML = `<p style='color:red;'>Error connecting to AI API</p>`;
      }
    };
  }
  return { init };
})();
