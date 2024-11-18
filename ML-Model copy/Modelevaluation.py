import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score, classification_report, roc_auc_score
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import GaussianNB
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Conv1D, Flatten, Dropout
from tensorflow.keras.optimizers import Adam
from sklearn.utils import shuffle
import joblib

# Load the dataset
def load_data():
    return pd.read_csv('combined_fraud_dataset.csv')  # Replace with your dataset path

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

# Build and evaluate CNN model
def evaluate_cnn(X_train, y_train, X_test, y_test):
    X_train_cnn = np.expand_dims(X_train.values, axis=2)
    X_test_cnn = np.expand_dims(X_test.values, axis=2)

    # CNN model architecture
    model = Sequential([
        Conv1D(32, kernel_size=2, activation='relu', input_shape=(X_train_cnn.shape[1], 1)),
        Dropout(0.2),
        Flatten(),
        Dense(64, activation='relu'),
        Dropout(0.2),
        Dense(1, activation='sigmoid')
    ])

    model.compile(optimizer=Adam(learning_rate=0.001), loss='binary_crossentropy', metrics=['accuracy'])

    # Train the model
    model.fit(X_train_cnn, y_train, epochs=10, batch_size=32, validation_data=(X_test_cnn, y_test), verbose=0)

    # Evaluate the model
    _, accuracy = model.evaluate(X_test_cnn, y_test, verbose=0)
    return model, accuracy

# Evaluate traditional models
def evaluate_traditional_models(X_train, y_train, X_test, y_test):
    models = {
        "Logistic Regression": LogisticRegression(),
        "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
        "Gradient Boosting": GradientBoostingClassifier(random_state=42),
        "Support Vector Machine": SVC(probability=True, random_state=42),
        "K-Nearest Neighbors": KNeighborsClassifier(),
        "Naive Bayes": GaussianNB()
    }

    results = []
    trained_models = {}

    for name, model in models.items():
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        roc_auc = roc_auc_score(y_test, model.predict_proba(X_test)[:, 1]) if hasattr(model, "predict_proba") else "N/A"
        results.append((name, accuracy, roc_auc))
        trained_models[name] = model
        print(f"{name} - Accuracy: {accuracy:.4f}, ROC-AUC: {roc_auc}")

    return results, trained_models

# Main script
if __name__ == "__main__":
    # Load and preprocess data
    print("Loading dataset...")
    data = load_data()
    print("Preprocessing data...")
    data, encoder, scaler = preprocess_data(data)

    # Split data into training and testing sets
    X = data.drop('is_fraud', axis=1)
    y = data['is_fraud']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Evaluate traditional models
    print("\nEvaluating traditional models...")
    traditional_results, traditional_models = evaluate_traditional_models(X_train, y_train, X_test, y_test)

    # Evaluate CNN model
    print("\nEvaluating CNN model...")
    cnn_model, cnn_accuracy = evaluate_cnn(X_train, y_train, X_test, y_test)

    # Combine results
    all_results = traditional_results + [("CNN", cnn_accuracy, "N/A")]

    # Find the best model
    sorted_results = sorted(all_results, key=lambda x: x[1], reverse=True)
    best_model_name = sorted_results[0][0]
    print(f"\nBest Model: {best_model_name}")

    # Save the best model
    if best_model_name in traditional_models:
        best_model = traditional_models[best_model_name]
        joblib.dump(best_model, 'best_fraud_detection_model.pkl')
    elif best_model_name == "CNN":
        cnn_model.save('best_fraud_detection_cnn_model.h5')

    # Save preprocessors
    joblib.dump(encoder, 'ip_geolocation_encoder.pkl')
    joblib.dump(scaler, 'numeric_scaler.pkl')

    print("Model and preprocessors saved successfully!")
