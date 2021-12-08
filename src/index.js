const dispatchRequest = async (request) => {
  const url = new URL(request.url)
  if (request.method == "POST" && url.pathname == "/command/fasty-echo") {
    return handleCommand(request)
  }
  return handleNotFound()
}

const handleCommand = async (request) => {
  const env = new Dictionary("env")
  const slack_token = env.get("SLACK_TOKEN")

  const params = new URLSearchParams(await request.text())

  const token = params.get('token')
  if (!(token == slack_token)) {
    return handleNotFound();
  }

  const message = params.get('text')
  const response_type = "in_channel"

  const data = {
    text: message,
    response_type: response_type
  }

  const response = new Response(JSON.stringify(data), {
    headers: { 'content-type': 'application/json' },
    status: 200,
  })
  return response
}

const handleNotFound = () => {
  return new Response("Not Found", {
    headers: { 'content-type': 'text/plain' },
    status: 404,
  })
}

addEventListener("fetch", (event) => event.respondWith(dispatchRequest(event.request)));