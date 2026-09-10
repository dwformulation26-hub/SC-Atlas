# Re-authorizing git push access via GitHub's device-login flow

Use this only on a local machine (or a device-bridge session) where a
`git push` fails with an authentication error, meaning the stored credential
has expired or been revoked. It does **not** apply to the scheduled cloud
routine: that clone is authenticated by the routine's own git source
configuration, and an auth failure there is fixed at the routine/GitHub App
level, not by minting a token in the sandbox.

This walks through GitHub's OAuth Device Authorization flow -- the same
mechanism `gh auth login` uses under the hood -- run manually via `curl` so
it works from a non-interactive shell.

The client ID below (`178c6fc778ccc68e1d6a`) is GitHub CLI's own public OAuth
client ID, safe to use for this purpose -- it's baked into the open-source
`gh` CLI itself, not a secret.

## Step 1: Request a device code

```bash
curl -s -X POST https://github.com/login/device/code \
  -H "Accept: application/json" \
  -d "client_id=178c6fc778ccc68e1d6a" \
  -d "scope=repo" > device_flow_state.json
cat device_flow_state.json
```

This returns JSON like:

```json
{"device_code":"...","user_code":"XXXX-XXXX","verification_uri":"https://github.com/login/device","expires_in":899,"interval":5}
```

Save the response to a file (as above) so it survives across separate shell
calls -- each call is a fresh shell, but the filesystem persists within the
session.

## Step 2: Have the user authorize it

Tell the user to:
1. Go to `https://github.com/login/device`
2. Enter the `user_code` shown
3. Sign in as **dwformulation26-hub** (the account that owns SC-Atlas) if
   prompted, and click Authorize

Signing in as the wrong account is the most common failure here: the flow
will complete successfully and still leave pushes to this repo failing.

The code expires in about 15 minutes (`expires_in` seconds). If it expires
before they finish, just repeat Step 1 for a fresh code.

## Step 3: Poll for the token

After the user confirms they've authorized it (don't poll before then --
GitHub will just return `authorization_pending` every time):

```bash
DEVICE_CODE=$(python3 -c "import json;print(json.load(open('device_flow_state.json'))['device_code'])")
curl -s -X POST https://github.com/login/oauth/access_token \
  -H "Accept: application/json" \
  -d "client_id=178c6fc778ccc68e1d6a" \
  -d "device_code=$DEVICE_CODE" \
  -d "grant_type=urn:ietf:params:oauth:grant-type:device_code" > token_response.json
cat token_response.json
```

If it still says `"error":"authorization_pending"`, the user hasn't actually
completed authorization yet (or authorized a different/expired code by
mistake) -- double-check with them and retry rather than assuming something
is broken. A successful response looks like:

```json
{"access_token":"gho_...","token_type":"bearer","scope":"repo"}
```

## Step 4: Store the credential

```bash
TOKEN=$(python3 -c "import json;print(json.load(open('token_response.json'))['access_token'])")
git config --global credential.helper store
echo "https://${TOKEN}:x-oauth-basic@github.com" > ~/.git-credentials
git config --global user.name "SC Atlas Bot"
git config --global user.email "dwformulation26@gmail.com"
```

Delete `device_flow_state.json` and `token_response.json` afterwards -- they
hold a live credential.

After this, `git push` from the repo clone should work without any further
authentication step. Verify with a harmless round-trip if you want certainty
before relying on it for a real update: create a throwaway branch, push it,
then delete it both locally and on the remote (`git push origin --delete
<branch>`) -- don't leave test branches lying around on the real repo.
