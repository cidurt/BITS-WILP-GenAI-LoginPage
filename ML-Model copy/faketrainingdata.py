from faker import Faker
import random
import pandas as pd

# Initialize Faker
fake = Faker()

# Generate synthetic data
def generate_synthetic_data(num_samples=1000):
    data = []
    for _ in range(num_samples):
        # Randomly assign if the data is human (0) or bot (1)
        is_fraud = random.choice([0, 1])
        
        # Time taken to enter phone number (humans take longer)
        time_to_enter_number = random.uniform(3, 10) if is_fraud == 0 else random.uniform(0.5, 2)
        
        # Time taken to click "Get SMS" after entering number
        time_to_click_get_sms = random.uniform(1, 3) if is_fraud == 0 else random.uniform(0.1, 0.5)
        
        # Time taken to enter OTP
        time_to_enter_otp = random.uniform(5, 15) if is_fraud == 0 else random.uniform(0.2, 3)
        
        # Mouse cursor movement count (humans are more erratic)
        mouse_movement = random.randint(50, 200) if is_fraud == 0 else random.randint(10, 30)
        
        # Button click position (bots often use fixed positions)
        button_click_position_x = random.randint(400, 800) if is_fraud == 0 else 450
        button_click_position_y = random.randint(300, 600) if is_fraud == 0 else 320
        
        # Typing speed (humans vary more)
        typing_speed = random.randint(100, 300) if is_fraud == 0 else random.randint(500, 800)
        
        # Browser fingerprinting (bots often use headless browsers)
        browser = fake.user_agent()
        is_headless = random.choice([0, 1]) if is_fraud == 1 else 0  # Bots more likely to be headless
        
        # Geo-location mismatch (bots more likely to mismatch)
        geo_mismatch = random.choice([0, 1]) if is_fraud == 1 else 0
        
        # Time spent on login page
        time_on_page = random.uniform(5, 20) if is_fraud == 0 else random.uniform(0.5, 3)
        
        # Keypress dynamics (humans vary)
        avg_keypress_duration = random.uniform(0.2, 1.5) if is_fraud == 0 else random.uniform(0.05, 0.2)
        
        data.append({
            "time_to_enter_number": time_to_enter_number,
            "time_to_click_get_sms": time_to_click_get_sms,
            "time_to_enter_otp": time_to_enter_otp,
            "mouse_movement": mouse_movement,
            "button_click_position_x": button_click_position_x,
            "button_click_position_y": button_click_position_y,
            "typing_speed": typing_speed,
            "browser": browser,
            "is_headless": is_headless,
            # "geo_mismatch": geo_mismatch,
            "time_on_page": time_on_page,
            "avg_keypress_duration": avg_keypress_duration,
            "is_fraud": is_fraud,
        })
    
    return pd.DataFrame(data)

# Generate 1000 synthetic samples
synthetic_data = generate_synthetic_data(1000)

# Save the data to a CSV file for training/testing purposes
file_path = "/mnt/data/synthetic_fraud_detection_data.csv"
synthetic_data.to_csv(file_path, index=False)

file_path
