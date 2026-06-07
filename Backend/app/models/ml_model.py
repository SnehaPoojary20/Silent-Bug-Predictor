import pickle

MODEL_PATH = "data/bug_model.pkl"

def load_model():
    with open(MODEL_PATH, "rb") as f:
        return pickle.load(f)

model = load_model()  