<WebView
  source={{ uri: 'https://sandbox.minepi.com/app/palace-of-quests' }}
  onMessage={event => {
    const data = JSON.parse(event.nativeEvent.data);
    console.log("Pi Auth Success", data);
  }}
/>