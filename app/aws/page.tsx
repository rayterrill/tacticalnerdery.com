import SyntaxHighlighter from 'react-syntax-highlighter';

export default function AWS() {
  const jsCode = `
function calculateFactorial(n) {
  // Base case
  if (n === 0 || n === 1) {
    return 1;
  }

  // Recursive case
  return n * calculateFactorial(n - 1);
}

// Calculate factorial of 5
const result = calculateFactorial(5);
console.log(\`Factorial of 5 is \{result}\`); // Output: Factorial of 5 is 120
`.trim()

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-4xl font-bold mb-6">AWS Notes</h1>
      <div className="prose-lg max-w-none">
        <h2>AWS SSO</h2>
        <h3>Configure your ~/.aws/config</h3>
        <SyntaxHighlighter
          language="shell"
          customStyle={{
            margin: 0,
            borderRadius: "0.5rem",
            fontSize: "0.9rem",
          }}
        >
          {`
[profile profile1]
sso_start_url = https://yourdomain.awsapps.com/start
sso_region = us-west-2
sso_account_id = youraccountid
sso_role_name = AdministratorAccess
region = us-west-2
output = json
          `.trim()}
        </SyntaxHighlighter>
        <h3>Login with SSO interactively and tell AWS which profile to use when running commands so you don’t need to add –profile to everything:</h3>
        <SyntaxHighlighter
          language="shell"
          customStyle={{
            margin: 0,
            borderRadius: "0.5rem",
            fontSize: "0.9rem",
          }}
        >
          {`
aws sso login --profile profile1
export AWS_PROFILE=profile1
          `.trim()}
        </SyntaxHighlighter>
        <h3>Login with SSO in a non-interactive session using device code (in a SSH session, etc):</h3>
        <SyntaxHighlighter
          language="shell"
          customStyle={{
            margin: 0,
            borderRadius: "0.5rem",
            fontSize: "0.9rem",
          }}
        >
          {`
aws sso login --profile profile1 --use-device-code
          `.trim()}
        </SyntaxHighlighter>
        <h3>See the details of our current login session:</h3>
        <SyntaxHighlighter
          language="shell"
          customStyle={{
            margin: 0,
            borderRadius: "0.5rem",
            fontSize: "0.9rem",
          }}
        >
          {`
aws sts get-caller-identity
          `.trim()}
        </SyntaxHighlighter>
        <h2>EKS</h2>
        <h3>Grab EKS Config</h3>
        <SyntaxHighlighter
          language="shell"
          customStyle={{
            margin: 0,
            borderRadius: "0.5rem",
            fontSize: "0.9rem",
          }}
        >
          {`
aws eks update-kubeconfig --name mycluster --region us-west-2
          `.trim()}
        </SyntaxHighlighter>
        <h3>Login to ECR</h3>
        <SyntaxHighlighter
          language="shell"
          customStyle={{
            margin: 0,
            borderRadius: "0.5rem",
            fontSize: "0.9rem",
          }}
        >
          {`
aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin ACCOUNT.dkr.ecr.us-west-2.amazonaws.com
          `.trim()}
        </SyntaxHighlighter>
        <h2>Random</h2>
        <h3>Log into an EC2 instance with SSH</h3>
        <SyntaxHighlighter
          language="shell"
          customStyle={{
            margin: 0,
            borderRadius: "0.5rem",
            fontSize: "0.9rem",
          }}
        >
          {`
ssh -i ~/.ssh/raytest.pem ubuntu@hostname.us-west-2.compute.amazonaws.com
          `.trim()}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}
