---
layout: page
title: Snippets
permalink: /snippets/
---

> Snippets or little things I cannot seem to remember but continue to need to get things done.

#### Import Powershell Module from a Specific Location
```
pwsh
cd my-module
import-module -name ./Module/
```
#### Curl with SNI Support and Client/mTLS
```
curl -k https://myhost.mydomain.com --cert public.pem --key private.pem --header "Host: myhost.mydomain.com" --resolve myhost.mydomain.com:443:20.231.112.51
```
#### Fix the Weird Terraform v0.12 Issue Where it Won't Load AWS Creds
This annoys the shit out of me and I always forget this command. :)
<pre class=code>
export AWS_SDK_LOAD_CONFIG=1
</pre>
<hr />
#### Use grep, awk, and xargs to Do Some Sketchy Stuff in a Cluster or with Terraform
Disclaimers: YMMV/IANAL/Don't try this at home I'm a professional :)

<pre class="code">
kubectl get po | grep Terminating | awk '{print $1}' | xargs kubectl delete po --force --grace-period=0

kubectl get po --all-namespaces | grep Terminating | awk '{print $2 " " $1}' | xargs printf 'kubectl delete po %s -n %s --force --grace-period=0\n'

kubectl get crd | grep kyverno | awk '{print $1}' | xargs kubectl delete crd

terraform state list | grep fastly | awk '{print "\x27"$1"\x27"}' | xargs terraform state rm #single quotes around the string
</pre>
<hr />
#### Clear the Console + Scrollback in the VS Code Console
I need to use the VSCode Console more instead of switching back/forth between the IDE and iTerm.
<pre class="code">
<kbd>CMD + K</kbd> or <kbd>CTRL + K</kbd>
</pre>
#### Add an Origin for Github
<pre class="code">
git remote add origin https://github.com/rayterrill/t.git
git branch -M main
git push -u origin main
</pre>
<hr />

#### Get Running AWS Instances with Filtering
```
aws ec2 describe-instances --filters "Name=tag:kubernetes.io/cluster/my-cluster,Values=owned" "Name=instance-state-name,Values=running" --region us-east-1 | jq '.Reservations | length'
```

#### Setting Up GPG with a Yubikey

1. Insert the compatible yubikey into the computer
2. Reset the pins if desired (recommended)
    1. `gpg --card-edit`
    2. Enter admin mode: `admin`
    3. Change the passwords if desired: `passwd`
3. Change the key size to 4096 (prob defaults to 2048)
    1. `gpg --card-edit`
    2. Enter admin mode: `admin`
    3. Change key attributes: `key-attr`
    4. Choose RSA
    5. Set the keysize to 4096. If prompted, enter the admin pin, which by default is 12345678, or the normal pin which by default is 123456.
4. Generate GPG key
    1. `gpg --card-edit`
    2. Enter admin mode: `admin`
    3. Generate key: `generate`
    4. Follow the prompts, and make sure your full name and email match what you have set in Github
5. Export the key to put into github
    1. Get the key id from the output from command 4, and use it here: `gpg --armor --export KEY_ID_FROM_STEP_4`
    2. Put the outputted PGP Public Key Block in Github
6. Configure Git to always sign:
    ```
    [credential]
        helper = osxkeychain
    [user]
        email = YOUR_EMAIL_ADDRESS_WHICH_MATCHES_GITHUB
        name = YOUR_FULLNAME_WHICH_MATCHES_GITHUB
        signingkey = KEY_ID_FROM_STEP_4
    [commit]
        gpgsign = true
    ```

##### Setting GPG with a Yubikey up on a New Computer

1. Make sure gpg and pinentry-mac are installed
2. export your public key
   ```
   gpg --output username.gpg --export YOUR_EMAIL_ADDRESS
   ```
3. copy the key over to the new computer
4. import the key on your computer
   ```
   gpg --import username.gpg
   ```
5. Configure pinentry and gpg (.gnupg/gpg-agent.conf - make sure you point to the correct path for pinentry on your machine):
   ```
   pinentry-program /opt/homebrew/bin/pinentry-mac
   ```
6. Pull the key into the local agent:
   ```
   gpg --card-edit
   > fetch
   > Ctrl+c
   gpg --card-status
   ```
6. Copy your .gitconfig over from your other machine
7. Restart gpg-agent:
   ```
   gpgconf --kill gpg-agent
   ```
