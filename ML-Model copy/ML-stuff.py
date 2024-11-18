import pandas as pd
import numpy as np
from scikit_learn.ensemble import RandomForestClassifier
from scikit_learn.model_selection import train_test_split
from scikit_learn.preprocessing import LabelEncoder, StandardScaler
from scikit_learn.metrics import classification_report, accuracy_score
import joblib
from ipaddress import ip_address, ip_network

# Load datasets
def load_datasets():
    # Load the credit card fraud dataset
    cc_fraud = pd.read_csv('creditcard.csv')  # Kaggle: Credit Card Fraud Detection
    cc_fraud = cc_fraud[['V1', 'V2', 'V3', 'Class']].rename(columns={
        'V1': 'otp_entry_time',  # Mapping anonymized feature to otp_entry_time
        'V2': 'digit_entry_intervals',
        'V3': 'keyboard_activity',
        'Class': 'is_fraud'
    })

    # Load keystroke dynamics dataset
    keystroke = pd.read_csv('keystroke.csv')  # Kaggle: Behavioral Biometrics
    keystroke['cursor_activity'] = keystroke['cursor_activity'].map({'Yes': 1, 'No': 0})
    keystroke = keystroke[['otp_entry_time', 'keyboard_activity', 'cursor_activity']]

    # Load mouse dynamics dataset
    mouse_dynamics = pd.read_csv('mouse.csv')  # Kaggle: Mouse Dynamics
    mouse_dynamics['cursor_activity'] = mouse_dynamics['MouseDetected']
    mouse_dynamics['is_fraud'] = mouse_dynamics['IsFraud']

    # Combine datasets
    combined_data = pd.concat([cc_fraud, keystroke, mouse_dynamics], ignore_index=True)

    # Load whitelist dataset
    whitelist = pd.read_csv('whitelist.csv')

    # Add IP-based features
    combined_data['ip_address'] = np.random.choice(whitelist['ip_address'], len(combined_data))
    combined_data = add_ip_whitelist_feature(combined_data, whitelist)

    return combined_data

# Add IP whitelisting feature
def add_ip_whitelist_feature(data, whitelist):
    whitelist_ips = whitelist[whitelist['whitelisted'] == 1]['ip_address'].tolist()

    def is_ip_whitelisted(ip):
        return int(ip in whitelist_ips)

    data['ip_whitelisted'] = data['ip_address'].apply(is_ip_whitelisted)
    return data

# Preprocess the data
def preprocess_data(data):
    # Handle missing values
    data.fillna(0, inplace=True)

    # Encode categorical features
    encoder = LabelEncoder()
    if 'ip_geolocation' in data.columns:
        data['ip_geolocation'] = encoder.fit_transform(data['ip_geolocation'])

    # Scale numerical features
    scaler = StandardScaler()
    numeric_features = [
        'otp_entry_time', 'digit_entry_intervals', 'keyboard_activity',
        'num_otp_requests', 'time_between_requests', 'otp_request_time'
    ]
    data[numeric_features] = scaler.fit_transform(data[numeric_features])

    return data, encoder, scaler

# Train the model
def train_model(data):
    # Split features and labels
    X = data.drop('is_fraud', axis=1)
    y = data['is_fraud']

    # Split into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train Random Forest Classifier
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Evaluate the model
    y_pred = model.predict(X_test)
    print("Accuracy:", accuracy_score(y_test, y_pred))
    print("Classification Report:")
    print(classification_report(y_test, y_pred))

    return model

# Main script
if __name__ == "__main__":
    # Load and preprocess data
    print("Loading datasets...")
    data = load_datasets()
    print("Preprocessing data...")
    data, encoder, scaler = preprocess_data(data)

    # Train the model
    print("Training the model...")
    model = train_model(data)

    # Save the model and preprocessors
    print("Saving the model...")
    joblib.dump(model, 'fraud_detection_model.pkl')
    joblib.dump(encoder, 'ip_geolocation_encoder.pkl')
    joblib.dump(scaler, 'numeric_scaler.pkl')
    print("Model and preprocessors saved successfully!")
