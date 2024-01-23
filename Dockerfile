FROM --platform=linux/amd64 alpine:3.19

# Add sudo and openssh-server
RUN apk update && \
    apk add python3 openssh-server && \
    echo "PermitRootLogin yes" >> /etc/ssh/sshd_config && \
    mkdir ~/.ssh && chmod -R 700 ~/.ssh && \
    ssh-keygen -A

COPY id_rsa.pub /root/.ssh/id_rsa.pub

RUN cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys && \
    chmod 644 ~/.ssh/id_rsa.pub && \
    chmod 644 ~/.ssh/authorized_keys

# start ssh with port exposed
EXPOSE 22

CMD ["/usr/sbin/sshd", "-D"]
