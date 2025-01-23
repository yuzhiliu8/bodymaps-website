FROM python:3.9

WORKDIR /app

ENV BASE_PATH=${BASE_PATH}
ENV SESSIONS_DIR_PATH=${SESSIONS_DIR_PATH}

ENV DB_USER=${DB_USER}
ENV DB_PASS=${DB_PASS}
ENV DB_HOST=${DB_HOST}
ENV DB_NAME=${DB_NAME}

COPY . .

#Install Dependencies
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

CMD ["gunicorn",  "-w", "2", "app:app", "--bind", "0.0.0.0:5000"]