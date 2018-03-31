FROM redis:4.0.9
COPY sentinel.conf /home/sentinel.conf
CMD [ "redis-sentinel", "/home/sentinel.conf" ]

EXPOSE 26380
