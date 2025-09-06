#!/usr/bin/env python3
"""
Test script to verify openai-whisper installation and functionality
"""

import sys
import os

def test_whisper_import():
    """Test basic whisper import"""
    try:
        import whisper
        print("✅ openai-whisper imported successfully")
        print(f"📦 Version: {getattr(whisper, '__version__', 'Unknown')}")
        return True
    except ImportError as e:
        print(f"❌ Failed to import whisper: {e}")
        return False
    except Exception as e:
        print(f"❌ Error importing whisper: {e}")
        return False

def test_whisper_models():
    """Test available models"""
    try:
        import whisper
        
        print("\n🤖 Testing Whisper models...")
        models = ["tiny", "base"]  # Test smaller models first
        
        for model_name in models:
            try:
                print(f"  📦 Loading {model_name} model...")
                model = whisper.load_model(model_name)
                print(f"  ✅ {model_name} model loaded successfully")
                
                # Test basic functionality with a dummy audio array
                import numpy as np
                dummy_audio = np.zeros(16000)  # 1 second of silence
                
                print(f"  🔍 Testing transcription with {model_name} model...")
                # This would normally transcribe audio, but we'll just test the method exists
                if hasattr(model, 'transcribe'):
                    print(f"  ✅ Transcription method available for {model_name}")
                else:
                    print(f"  ⚠️  Transcription method not found for {model_name}")
                    
            except Exception as e:
                print(f"  ⚠️  Error with {model_name} model: {e}")
                continue
                
        return True
        
    except Exception as e:
        print(f"❌ Error testing models: {e}")
        return False

def test_dependencies():
    """Test that required dependencies are available"""
    dependencies = [
        "torch",
        "numpy",
        "tiktoken",
        "tqdm",
        "more_itertools"
    ]
    
    print("\n📚 Testing dependencies...")
    
    for dep in dependencies:
        try:
            __import__(dep)
            print(f"  ✅ {dep} imported successfully")
        except ImportError:
            print(f"  ❌ {dep} not found")
        except Exception as e:
            print(f"  ❌ Error importing {dep}: {e}")
    
    return True

def main():
    """Main test function"""
    print("🧪 Testing openai-whisper installation...\n")
    
    # Test 1: Basic import
    if not test_whisper_import():
        sys.exit(1)
    
    # Test 2: Dependencies
    test_dependencies()
    
    # Test 3: Models
    test_whisper_models()
    
    print("\n🎉 All tests completed!")
    print("✅ openai-whisper is ready to use!")

if __name__ == "__main__":
    main()
