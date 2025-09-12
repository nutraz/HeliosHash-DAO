# Use official Node.js LTS image as the base
FROM ubuntu:22.04

# Set working directory
WORKDIR /app

# Install system dependencies for Dfinity SDK and build tools
RUN apt-get update && \
	apt-get install -y curl build-essential libssl-dev pkg-config ca-certificates && \
	rm -rf /var/lib/apt/lists/*

# Install Node.js 20.x and pnpm
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
	apt-get install -y nodejs && \
	npm install -g pnpm && \
	rm -rf /var/lib/apt/lists/*

# Install Dfinity SDK (dfx)
ENV DFX_VERSION=0.17.0
RUN curl -LO https://github.com/dfinity/sdk/releases/download/${DFX_VERSION}/dfx-${DFX_VERSION}-x86_64-linux.tar.gz && \
	tar -xzf dfx-${DFX_VERSION}-x86_64-linux.tar.gz && \
	mv dfx /usr/local/bin/ && \
	rm -rf dfx dfx-${DFX_VERSION}-x86_64-linux.tar.gz

# Add dfx to PATH
ENV PATH="/usr/local/bin:${PATH}"

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .


# Build the frontend only (canisters will be created/built at runtime)
RUN pnpm build

# Expose port for Vite dev server or production server
EXPOSE 3000

# Default command to start the app (adjust if needed)
CMD bash -c "dfx start --background && pnpm dev"
