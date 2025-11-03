type DetectedProvider = 'clerk' | 'betterauth' | 'workos' | null;

function isPackageInstalled(packageName: string): boolean {
  try {
    require.resolve(packageName);
    return true;
  } catch {
    return false;
  }
}

export function detectAuthProvider(): DetectedProvider {
  if (
    isPackageInstalled('@clerk/backend') ||
    isPackageInstalled('@clerk/clerk-sdk-node') ||
    isPackageInstalled('@clerk/express')
  ) {
    return 'clerk';
  }

  if (
    isPackageInstalled('better-auth') ||
    isPackageInstalled('@better-auth/core') ||
    isPackageInstalled('@better-auth/node')
  ) {
    return 'betterauth';
  }

  if (
    isPackageInstalled('@workos-inc/node') ||
    isPackageInstalled('@workos-inc/authkit-nextjs')
  ) {
    return 'workos';
  }

  return null;
}

export function getDefaultProvider(): 'clerk' | 'betterauth' | 'workos' {
  const detected = detectAuthProvider();
  return detected || 'workos';
}

