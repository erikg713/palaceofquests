using UnityEngine;

public class PiAuthBridge : MonoBehaviour
{
    [System.Serializable]
    public class PiUser
    {
        public string uid;
        public string username;
        public string accessToken;
    }

    public void OnPiAuthSuccess(string json)
    {
        var user = JsonUtility.FromJson<PiUser>(json);
        Debug.Log($"Logged in as {user.username}");
        PlayerPrefs.SetString("pi_user", json);
    }

    public void OnPiAuthError(string error)
    {
        Debug.LogError("Pi Auth failed: " + error);
    }
}
