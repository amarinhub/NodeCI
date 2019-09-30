
# From Response Headers | Chrome DevTools
set-cookie: session=eyJwYXNzcG9ydCI6eyJ1c2VyIjoiNWQ4ZjlmNTNiODBjMzIzODc4ODk3Mzc0In19; path=/; expires=Tue, 29 Oct 2019 13:05:26 GMT; httponly
set-cookie: session.sig=_zFHLq-2e77xJOklr8jzmf2DppA; path=/; expires=Tue, 29 Oct 2019 13:05:26 GMT; httponly

node
> const session ='eyJwYXNzcG9ydCI6eyJ1c2VyIjoiNWQ4ZjlmNTNiODBjMzIzODc4ODk3Mzc0In19'
undefined
> const Buffer = require('safe-buffer').Buffer;
undefined
> Buffer.from(session, 'base64').toString('utf8')
'{"passport":{"user":"5d8f9f53b80c323878897374"}}'
>


# Generate sessio.sig 
C:\Projects\NodeJS\AdvancedNodeStarter>node
> const session = 'eyJwYXNzcG9ydCI6eyJ1c2VyIjoiNWQ4ZjlmNTNiODBjMzIzODc4ODk3Mzc0In19'
undefined
> const Keygrip = require('keygrip');
undefined
> const keygrip = new Keygrip(['123123123'])
undefined
> keygrip.sign('session='+ session)
'_zFHLq-2e77xJOklr8jzmf2DppA'

> keygrip.verify('session=' + session, '_zFHLq-2e77xJOklr8jzmf2DppA')
true

> keygrip.verify('session=' + session, '_FAKEzFHLq-2e77xJOklr8jzmf2DppA')
false
>.exit
