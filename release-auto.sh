#!/bin/bash

# Script to create automatic releases with version increment
# Usage: ./release-auto.sh [major|minor|patch]
# Default increments patch

set -e

# Function to get current version from package.json
get_current_version() {
    grep -o '"version": "[^"]*"' package.json | cut -d'"' -f4
}

# Function to increment version
increment_version() {
    local version=$1
    local type=${2:-patch}
    
    IFS='.' read -ra PARTS <<< "$version"
    local major=${PARTS[0]}
    local minor=${PARTS[1]}
    local patch=${PARTS[2]}
    
    case $type in
        major)
            major=$((major + 1))
            minor=0
            patch=0
            ;;
        minor)
            minor=$((minor + 1))
            patch=0
            ;;
        patch)
            patch=$((patch + 1))
            ;;
        *)
            echo "❌ Error: Invalid increment type. Use: major, minor or patch"
            exit 1
            ;;
    esac
    
    echo "$major.$minor.$patch"
}

# Main function
main() {
    local increment_type=${1:-patch}
    
    if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
        echo "Usage: $0 [major|minor|patch]"
        echo ""
        echo "Automatically increments version and creates a release:"
        echo "  major - Increments major version (1.0.0 -> 2.0.0)"
        echo "  minor - Increments minor version (1.0.0 -> 1.1.0)"
        echo "  patch - Increments patch version (1.0.0 -> 1.0.1) [default]"
        echo ""
        echo "Examples:"
        echo "  $0        # Increments patch"
        echo "  $0 patch  # Increments patch"
        echo "  $0 minor  # Increments minor"
        echo "  $0 major  # Increments major"
        exit 0
    fi
    
    local current_version=$(get_current_version)
    local new_version=$(increment_version "$current_version" "$increment_type")
    
    echo "🔄 Automatic version increment:"
    echo "   Current version: $current_version"
    echo "   New version:     $new_version"
    echo "   Type:           $increment_type"
    echo ""
    
    # Confirm before proceeding
    read -p "Proceed with release v$new_version? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Release cancelled by user"
        exit 1
    fi
    
    # Execute main release script
    ./release.sh "$new_version"
}

main "$@"
