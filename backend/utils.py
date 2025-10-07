from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os 

# to get a string like this run:
# openssl rand -hex 32
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    password_bytes = password.encode('utf-8')
    if len(password_bytes) > 72:
        trancuted = password_bytes[:72].decode('utf-8', 'ignore')
    else:
        trancuted = password
    return pwd_context.hash(trancuted)

def verify_password(plain_password, hashed_password):
    # Apply same truncation as hash_password
    password_bytes = plain_password.encode("utf-8")
    if len(password_bytes) > 72:
        truncated = password_bytes[:72].decode("utf-8", "ignore")
    else:
        truncated = plain_password
    return pwd_context.verify(truncated, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp" : expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)