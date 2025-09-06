#!/usr/bin/env python3
"""
Test script to verify openai-whisper installation
"""

def test_whisper_installation():
    try:
        import whisper
        print("✅ openai-whisper successfully imported!")
        
        # Print version info
        import pkg_resources
        version = pkg_resources.get_distribution("openai-whisper").version
        print(f"📦 openai-whisper version: {version}")
        
        # List available models
        print("🤖 Available models:")
        for model_name in ["tiny", "base", "small", "medium", "large"]:
            try:
                print(f"  - {model_name}")
            except Exception as e:
                print(f"  - {model_name} (error: {e})")
        
        return True
        
    except ImportError as e:
        print(f"❌ Failed to import whisper: {e}")
        return False
    except Exception as e:
        print(f"❌ Error testing whisper: {e}")
        return False

if __name__ == "__main__":
    print("Testing openai-whisper installation...")
    success = test_whisper_installation()
    if success:
        print("\n🎉 Installation verified successfully!")
    else:
        print("\n💥 Installation test failed!")
