from app.utils.pi_network import PiNetwork
import os

# Initialize Pi SDK
pi = PiNetwork()
pi.initialize(
    api_key=os.getenv("PI_API_KEY"),
    wallet_private_key=os.getenv("PI_WALLET_SECRET"),
    network="Pi Network"  # or "Pi Testnet"
)
